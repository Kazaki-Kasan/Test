import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCoreProps {
  color: string;
  onRotationUpdate?: (x: number, y: number, z: number) => void;
  dischargeTrigger?: number; // increments when recalibrate is clicked
  onCoreInteracted?: () => void;
}

export const ThreeCore: React.FC<ThreeCoreProps> = ({
  color,
  onRotationUpdate,
  dischargeTrigger,
  onCoreInteracted,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const crystalRef = useRef<THREE.Mesh | null>(null);
  const innerCoreRef = useRef<THREE.Mesh | null>(null);
  const nodesRef = useRef<THREE.Group | null>(null);
  const sparksRef = useRef<THREE.Group | null>(null);
  const requestRef = useRef<number | null>(null);

  // Drag interaction state
  const isDragging = useRef(false);
  const previousPoint = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Update color when prop changes
  useEffect(() => {
    if (crystalRef.current) {
      const material = crystalRef.current.material as THREE.MeshPhongMaterial;
      material.color.set(color);
      // Emissive highlights
      const emissiveColor = new THREE.Color(color).multiplyScalar(0.4);
      material.emissive.copy(emissiveColor);
    }
  }, [color]);

  // Handle external discharge triggers
  useEffect(() => {
    if (dischargeTrigger && dischargeTrigger > 0 && crystalRef.current) {
      triggerFlashDischarge();
    }
  }, [dischargeTrigger]);

  const triggerFlashDischarge = () => {
    if (!crystalRef.current || !sparksRef.current) return;

    // Flash scale
    crystalRef.current.scale.set(1.4, 1.4, 1.4);

    // Create a burst of spark particles
    const origin = new THREE.Vector3(0, 0, 0);
    const count = 35;
    const sparkGeometry = new THREE.BoxGeometry(0.03, 0.15, 0.03);

    for (let i = 0; i < count; i++) {
      const col = new THREE.Color(color).clone();
      // vary hue slightly for premium electric feel
      col.offsetHSL((Math.random() - 0.5) * 0.1, 0, 0);
      
      const sparkMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 1.0,
      });

      const spark = new THREE.Mesh(sparkGeometry, sparkMat);
      spark.position.copy(origin);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.12 + Math.random() * 0.18;

      spark.userData = {
        velocity: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        ),
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03,
      };

      spark.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      sparksRef.current.add(spark);
    }

    if (onCoreInteracted) {
      onCoreInteracted();
    }
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    // 1. Initial Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 6.5;
    camera.position.y = 0.2;
    cameraRef.current = camera;

    // 3. Renderer Setup
    // Ensure alpha is true for beautiful background gradients from our css
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // 4. Lighting System
    // Soft environmental blue-cyan ambient
    const ambientLight = new THREE.AmbientLight(0x0a1e34, 0.6);
    scene.add(ambientLight);

    // Bright dynamic point source for core specularity
    const pointLight = new THREE.PointLight(0xffffff, 3, 100);
    pointLight.position.set(4, 5, 4);
    scene.add(pointLight);

    // Subtle soft fill light
    const fillLight = new THREE.DirectionalLight(color, 2);
    fillLight.position.set(-4, -2, -4);
    scene.add(fillLight);

    // 5. Centerpiece glowing Octahedron Crystal
    const geometry = new THREE.OctahedronGeometry(1.6, 0);
    const initialEmissive = new THREE.Color(color).multiplyScalar(0.4);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      emissive: initialEmissive,
      shininess: 120,
      transparent: true,
      opacity: 0.8,
      flatShading: true,
    });

    const crystal = new THREE.Mesh(geometry, material);
    crystal.name = 'nexus_core_crystal';
    scene.add(crystal);
    crystalRef.current = crystal;

    // 6. Inner Core glowing structure (wireframe octahedron revolving inverted)
    const innerGeo = new THREE.OctahedronGeometry(0.8, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    crystal.add(innerCore);
    innerCoreRef.current = innerCore;

    // 7. Grid Helper for scientific, command center feel
    const gridHelper = new THREE.GridHelper(16, 16, 0x00dbe9, 0x071e35);
    gridHelper.position.y = -2.8;
    // Typecast to avoid TS error on GridHelper material
    const gridMaterial = gridHelper.material as THREE.Material;
    gridMaterial.opacity = 0.15;
    gridMaterial.transparent = true;
    scene.add(gridHelper);

    // 8. Revolving Data Nodes
    const nodes = new THREE.Group();
    scene.add(nodes);
    nodesRef.current = nodes;

    const nodeCount = 45;
    const nodeGeometry = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x7df4ff,
      transparent: true,
      opacity: 0.8,
    });

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const radius = 2.4 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      node.position.x = radius * Math.sin(phi) * Math.cos(theta);
      node.position.y = radius * Math.sin(phi) * Math.sin(theta);
      node.position.z = radius * Math.cos(phi);

      node.userData = {
        originalPos: node.position.clone(),
        speed: 0.008 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
        radius,
      };

      nodes.add(node);
    }

    // 9. Sparks Group for Discharge System
    const sparks = new THREE.Group();
    scene.add(sparks);
    sparksRef.current = sparks;

    // 10. Pointer Raycasting for Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      previousPoint.current = { x: clientX, y: clientY };

      // Raycast detection
      const bounds = canvasRef.current!.getBoundingClientRect();
      const x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -((clientY - bounds.top) / bounds.height) * 2 + 1;

      mouse.x = x;
      mouse.y = y;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(crystal);

      if (intersects.length > 0) {
        // Core was direct clicked
        const point = intersects[0].point;
        
        // Temporarily intensify emission on crystal
        material.emissive.setHex(0xffffff);
        setTimeout(() => {
          if (crystalRef.current) {
            const currentEmissive = new THREE.Color(color).multiplyScalar(0.4);
            material.emissive.copy(currentEmissive);
          }
        }, 120);

        // Burst sparks at click point
        const sparkGeometry = new THREE.BoxGeometry(0.02, 0.12, 0.02);
        for (let i = 0; i < 20; i++) {
          const col = new THREE.Color(color).clone();
          col.offsetHSL((Math.random() - 0.5) * 0.08, 0, 0);

          const sparkMat = new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: 1.0,
          });

          const spark = new THREE.Mesh(sparkGeometry, sparkMat);
          spark.position.copy(point);

          const devTheta = Math.random() * Math.PI * 2;
          const devPhi = Math.random() * Math.PI;
          const speed = 0.08 + Math.random() * 0.15;

          spark.userData = {
            velocity: new THREE.Vector3(
              Math.sin(devPhi) * Math.cos(devTheta) * speed,
              Math.sin(devPhi) * Math.sin(devTheta) * speed,
              Math.cos(devPhi) * speed
            ),
            life: 1.0,
            decay: 0.025 + Math.random() * 0.035,
          };

          sparks.add(spark);
        }

        if (onCoreInteracted) {
          onCoreInteracted();
        }
      }
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      if (isDragging.current) {
        const deltaX = clientX - previousPoint.current.x;
        const deltaY = clientY - previousPoint.current.y;

        targetRotation.current.y += deltaX * 0.007;
        targetRotation.current.x += deltaY * 0.007;

        previousPoint.current = { x: clientX, y: clientY };
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const element = canvasRef.current;
    element.addEventListener('mousedown', handlePointerDown);
    element.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    element.addEventListener('touchstart', handlePointerDown);
    element.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    // 11. Animation Loop & Calculations
    let time = 0;
    const animateScene = () => {
      time += 0.01;

      // Rotate camera/scene slightly or let core rotate automatically
      // Autorotation when not dragged
      if (!isDragging.current) {
        targetRotation.current.y += 0.004;
        targetRotation.current.x = Math.sin(time * 0.5) * 0.15; // float slightly
      }

      // Physics interpolation (lerp)
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.15;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.15;

      if (crystal) {
        crystal.rotation.x = currentRotation.current.x;
        crystal.rotation.y = currentRotation.current.y;
        crystal.position.y = Math.sin(time) * 0.12; // vertical floating

        // Lerp size back to standard after discharge spikes
        crystal.scale.x += (1.0 - crystal.scale.x) * 0.1;
        crystal.scale.y += (1.0 - crystal.scale.y) * 0.1;
        crystal.scale.z += (1.0 - crystal.scale.z) * 0.1;

        // Callback with updated telemetry coordinates
        if (onRotationUpdate) {
          // Normalize rotation output around degrees or simple decimal text
          onRotationUpdate(crystal.rotation.x, crystal.rotation.y, crystal.rotation.z);
        }
      }

      if (innerCore) {
        // revolving inverted
        innerCore.rotation.x -= 0.012;
        innerCore.rotation.y -= 0.008;
        // pulse rate
        const pulseScalar = 1 + Math.sin(time * 2.5) * 0.14;
        innerCore.scale.set(pulseScalar, pulseScalar, pulseScalar);
      }

      // Rotate/Orbit data node clusters
      if (nodes && nodes.children) {
        nodes.children.forEach((node, i) => {
          const uData = node.userData;
          // compute revolution orbit around core
          const speedFactor = uData.speed;
          uData.phase += speedFactor;
          
          const angle = uData.phase;
          const rad = uData.radius;
          node.position.x = rad * Math.sin(angle) * Math.cos(angle * 0.3);
          node.position.z = rad * Math.cos(angle);
          node.position.y = rad * Math.sin(angle * 0.5) * Math.sin(angle * 0.8) * 0.5;

          // faint pulsing size
          const nodePulse = 0.8 + Math.sin(time * 4 + i) * 0.25;
          node.scale.set(nodePulse, nodePulse, nodePulse);
        });
        
        nodes.rotation.y += 0.0008;
      }

      // Process Spark physics and lifecycle
      if (sparks && sparks.children.length > 0) {
        for (let i = sparks.children.length - 1; i >= 0; i--) {
          const spark = sparks.children[i] as THREE.Mesh;
          const uData = spark.userData;

          spark.position.add(uData.velocity);
          uData.life -= uData.decay;
          
          const mat = spark.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.max(0, uData.life);
          spark.scale.setScalar(Math.max(0.01, uData.life));

          if (uData.life <= 0) {
            sparks.remove(spark);
            spark.geometry.dispose();
            mat.dispose();
          }
        }
      }

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animateScene);
    };

    animateScene();

    // 12. Fluid Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Cleanup logic
    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      element.removeEventListener('mousedown', handlePointerDown);
      element.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      element.removeEventListener('touchstart', handlePointerDown);
      element.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      renderer.dispose();
    };
  }, [onRotationUpdate, onCoreInteracted, color]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      <canvas
        id="nexus-core-3d-canvas"
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />
    </div>
  );
};
