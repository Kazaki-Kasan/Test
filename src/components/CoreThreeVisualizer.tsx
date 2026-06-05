/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CoreThreeVisualizerProps {
  coreFrequency: number;       // GHz, affects base spin speeds
  particleDensity: number;     // affects number of floating nodes
  isRecalibrating: boolean;    // speeds up spin and adds flare pulses during calibrations
}

export default function CoreThreeVisualizer({
  coreFrequency,
  particleDensity,
  isRecalibrating,
}: CoreThreeVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // References for mutable animation values to avoid React re-render lagging
  const paramsRef = useRef({ coreFrequency, particleDensity, isRecalibrating });
  paramsRef.current = { coreFrequency, particleDensity, isRecalibrating };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Camera placement
    camera.position.z = 6.5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x00dbe9, 0.65);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 100);
    pointLight.position.set(5, 8, 5);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x4f46e5, 1.5, 50);
    secondaryLight.position.set(-5, -5, -3);
    scene.add(secondaryLight);

    // Octahedron Centerpiece Crystal
    const crystalGeo = new THREE.OctahedronGeometry(1.65, 0);
    const crystalMat = new THREE.MeshPhongMaterial({
      color: 0x00dbe9,
      emissive: 0x003e42,
      shininess: 95,
      transparent: true,
      opacity: 0.8,
      flatShading: true,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    scene.add(crystal);

    // Inner wireframe node
    const innerGeo = new THREE.IcosahedronGeometry(0.88, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xdbfcff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    crystal.add(innerCore);

    // Data Nodes Floating Particles Group
    const nodesCount = Math.floor(40 * (particleDensity / 100));
    const nodes = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.045, 6, 6);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x7df4ff,
      transparent: true,
      opacity: 0.8,
    });

    const particlesData: Array<{
      originalPos: THREE.Vector3;
      speed: number;
      offset: number;
    }> = [];

    for (let i = 0; i < nodesCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      
      // Spherical coordinate distribution
      const r = 2.4 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      node.position.x = r * Math.sin(phi) * Math.cos(theta);
      node.position.y = r * Math.sin(phi) * Math.sin(theta);
      node.position.z = r * Math.cos(phi);

      particlesData.push({
        originalPos: node.position.clone(),
        speed: 0.012 + Math.random() * 0.018,
        offset: Math.random() * Math.PI * 2,
      });

      nodes.add(node);
    }
    scene.add(nodes);

    // ResizeObserver configuration for container bounding box
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width || container.clientWidth;
      const h = entry.contentRect.height || container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Core Animation Engine
    let requestID: number;
    let time = 0;

    const animate = () => {
      requestID = requestAnimationFrame(animate);

      // Access parameters safely from ref
      const currentFreq = paramsRef.current.coreFrequency;
      const recalibrating = paramsRef.current.isRecalibrating;

      // Base time step scales up with frequency and calibration states
      const speedMultiplier = recalibrating ? 4.5 : (currentFreq / 2.5);
      time += 0.008 * speedMultiplier;

      // Crystal Rotations
      crystal.rotation.y += 0.004 * speedMultiplier;
      crystal.rotation.z += 0.0015 * speedMultiplier;
      crystal.position.y = Math.sin(time) * 0.16;

      // Emissive pulse matching the glow oscillation
      const pulseIntensity = 0.5 + Math.sin(time * 2) * 0.35;
      crystalMat.emissive.setHex(recalibrating ? 0x00dbe9 : 0x003e42);
      crystalMat.emissiveIntensity = recalibrating 
        ? 1.5 + Math.sin(time * 8) * 0.8
        : pulseIntensity;

      // Wireframe nested core breathing
      innerCore.rotation.x -= 0.007 * speedMultiplier;
      const coreScale = 1.0 + Math.sin(time * 2.5) * 0.08;
      innerCore.scale.setScalar(recalibrating ? 1.0 + Math.sin(time * 9) * 0.2 : coreScale);

      // Particle oscillation orbits
      nodes.children.forEach((node, idx) => {
        const data = particlesData[idx];
        if (!data) return;

        const pulseScale = 0.85 + Math.sin(time * 2.5 + idx) * 0.25;
        node.scale.setScalar(pulseScale);

        // Circular wobble drift
        node.position.y = data.originalPos.y + Math.sin(time + idx) * 0.38;
        node.position.x = data.originalPos.x + Math.cos(time * 0.6 + idx) * 0.25;
      });

      nodes.rotation.y += 0.0008 * speedMultiplier;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up WebGL resources and listeners
    return () => {
      cancelAnimationFrame(requestID);
      resizeObserver.disconnect();
      crystalGeo.dispose();
      crystalMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
