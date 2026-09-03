import * as THREE from "three";
import { ThreeDThemeType } from "../types";

export interface PaletteConfig {
  primary: number;
  secondary: number;
  accent: number;
  bg: number;
  bgHex: string;
}

export const COLOR_PALETTES: Record<string, PaletteConfig> = {
  "indigo-violet": {
    primary: 0x6366f1,
    secondary: 0xa855f7,
    accent: 0x38bdf8,
    bg: 0x09090b,
    bgHex: "#09090b",
  },
  "golden-hour": {
    primary: 0xf59e0b,
    secondary: 0xf43f5e,
    accent: 0xfde047,
    bg: 0x180d05,
    bgHex: "#180d05",
  },
  "cyber-neon": {
    primary: 0x06b6d4,
    secondary: 0xec4899,
    accent: 0x8b5cf6,
    bg: 0x050814,
    bgHex: "#050814",
  },
  "emerald-zen": {
    primary: 0x10b981,
    secondary: 0x059669,
    accent: 0x6ee7b7,
    bg: 0x04130d,
    bgHex: "#04130d",
  },
  "monochrome-dark": {
    primary: 0xe4e4e7,
    secondary: 0x71717a,
    accent: 0xa1a1aa,
    bg: 0x09090b,
    bgHex: "#09090b",
  },
  "pastel-dream": {
    primary: 0xf472b6,
    secondary: 0xc084fc,
    accent: 0x60a5fa,
    bg: 0x120c1f,
    bgHex: "#120c1f",
  },
  "ruby-rose": {
    primary: 0xe11d48,
    secondary: 0xbe123c,
    accent: 0xfb7185,
    bg: 0x140306,
    bgHex: "#140306",
  },
};

export interface ThreeSceneInstance {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  sceneGroup: THREE.Group;
  update: (time: number, delta: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export function createThreeScene(
  theme: ThreeDThemeType | string = "liquid-waves",
  colorPreset = "indigo-violet",
  speed = 1.0,
  width = 400,
  height = 700
): ThreeSceneInstance {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 30;

  const palette = COLOR_PALETTES[colorPreset] || COLOR_PALETTES["indigo-violet"];

  // Scene group
  const sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(palette.primary, 3.5, 120);
  pointLight1.position.set(20, 20, 25);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(palette.secondary, 3.5, 120);
  pointLight2.position.set(-20, -20, 25);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(palette.accent, 2.0, 100);
  pointLight3.position.set(0, 25, 15);
  scene.add(pointLight3);

  let updateTheme: (time: number, delta: number) => void = () => {};
  const disposables: { dispose: () => void }[] = [];

  if (theme === "liquid-waves") {
    const geometry = new THREE.PlaneGeometry(75, 75, 50, 50);
    disposables.push(geometry);
    const posAttr = geometry.attributes.position;
    const initialPositions = posAttr.array.slice();

    const material = new THREE.MeshStandardMaterial({
      color: palette.primary,
      wireframe: true,
      roughness: 0.25,
      metalness: 0.85,
      emissive: palette.secondary,
      emissiveIntensity: 0.35,
    });
    disposables.push(material);

    const waveMesh = new THREE.Mesh(geometry, material);
    waveMesh.rotation.x = -Math.PI / 2.3;
    waveMesh.position.y = -6;
    sceneGroup.add(waveMesh);

    // Particle dust
    const pCount = 300;
    const partGeo = new THREE.BufferGeometry();
    disposables.push(partGeo);
    const partPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      partPos[i] = (Math.random() - 0.5) * 55;
      partPos[i + 1] = (Math.random() - 0.5) * 45;
      partPos[i + 2] = (Math.random() - 0.5) * 35;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.5,
      color: palette.accent,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(partMat);
    const particles = new THREE.Points(partGeo, partMat);
    sceneGroup.add(particles);

    updateTheme = (time) => {
      const positions = posAttr.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const u = initialPositions[i];
        const v = initialPositions[i + 1];
        positions[i + 2] =
          Math.sin(u * 0.2 + time * 1.5 * speed) * 2.8 +
          Math.cos(v * 0.2 + time * 1.2 * speed) * 2.5 +
          Math.sin((u + v) * 0.15 + time * 0.8 * speed) * 1.6;
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = time * 0.05 * speed;
      waveMesh.rotation.z = Math.sin(time * 0.2 * speed) * 0.05;
    };
  } else if (theme === "cosmic-starfield") {
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    disposables.push(geometry);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(palette.primary);
    const color2 = new THREE.Color(palette.secondary);
    const color3 = new THREE.Color(palette.accent);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 90;
      positions[i + 1] = (Math.random() - 0.5) * 90;
      positions[i + 2] = (Math.random() - 0.5) * 90;

      const mixed = Math.random() > 0.6 ? color1 : Math.random() > 0.3 ? color2 : color3;
      colors[i] = mixed.r;
      colors[i + 1] = mixed.g;
      colors[i + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(material);

    const stars = new THREE.Points(geometry, material);
    sceneGroup.add(stars);

    const sphereGeo = new THREE.SphereGeometry(8, 28, 28);
    disposables.push(sphereGeo);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: palette.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    disposables.push(sphereMat);
    const nebulaSphere = new THREE.Mesh(sphereGeo, sphereMat);
    sceneGroup.add(nebulaSphere);

    updateTheme = (time) => {
      stars.rotation.y = time * 0.08 * speed;
      stars.rotation.x = time * 0.04 * speed;
      nebulaSphere.rotation.y = -time * 0.12 * speed;
      nebulaSphere.rotation.z = time * 0.06 * speed;
    };
  } else if (theme === "floating-gems") {
    const gemGeometries = [
      new THREE.IcosahedronGeometry(3.5, 0),
      new THREE.OctahedronGeometry(3, 0),
      new THREE.DodecahedronGeometry(2.8, 0),
      new THREE.TetrahedronGeometry(3.2, 0),
      new THREE.TorusGeometry(3, 0.8, 16, 32),
    ];
    gemGeometries.forEach((g) => disposables.push(g));

    const gems: {
      mesh: THREE.Mesh;
      rotSpeed: { x: number; y: number; z: number };
      baseY: number;
      floatSpeed: number;
    }[] = [];

    for (let i = 0; i < 11; i++) {
      const geo = gemGeometries[i % gemGeometries.length];
      const isWire = i % 2 === 0;
      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? palette.primary : i % 3 === 1 ? palette.secondary : palette.accent,
        wireframe: isWire,
        roughness: 0.2,
        metalness: 0.9,
        emissive: palette.primary,
        emissiveIntensity: 0.2,
      });
      disposables.push(mat);

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = (Math.random() - 0.5) * 38;
      mesh.position.y = (Math.random() - 0.5) * 38;
      mesh.position.z = (Math.random() - 0.5) * 20 - 4;

      const scale = 0.6 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      sceneGroup.add(mesh);
      gems.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.8,
          y: (Math.random() - 0.5) * 0.8,
          z: (Math.random() - 0.5) * 0.8,
        },
        baseY: mesh.position.y,
        floatSpeed: 0.8 + Math.random() * 0.8,
      });
    }

    updateTheme = (time) => {
      gems.forEach((gem, idx) => {
        gem.mesh.rotation.x += gem.rotSpeed.x * 0.02 * speed;
        gem.mesh.rotation.y += gem.rotSpeed.y * 0.02 * speed;
        gem.mesh.rotation.z += gem.rotSpeed.z * 0.02 * speed;
        gem.mesh.position.y = gem.baseY + Math.sin(time * gem.floatSpeed * speed + idx) * 2.8;
      });
    };
  } else if (theme === "aurora-ribbon") {
    const curveCount = 4;
    const ribbons: THREE.Mesh[] = [];

    for (let c = 0; c < curveCount; c++) {
      const ribbonGeo = new THREE.PlaneGeometry(55, 7, 65, 10);
      disposables.push(ribbonGeo);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: c === 0 ? palette.primary : c === 1 ? palette.secondary : palette.accent,
        wireframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        emissive: c === 0 ? palette.primary : palette.secondary,
        emissiveIntensity: 0.35,
      });
      disposables.push(ribbonMat);

      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.position.y = (c - 1.5) * 6;
      ribbon.rotation.z = c * 0.25 - 0.35;
      sceneGroup.add(ribbon);
      ribbons.push(ribbon);
    }

    updateTheme = (time) => {
      ribbons.forEach((ribbon, rIdx) => {
        const geo = ribbon.geometry as THREE.PlaneGeometry;
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z =
            Math.sin(x * 0.15 + time * 1.6 * speed + rIdx) * 3.5 +
            Math.cos(y * 0.2 + time * speed) * 1.8;
          pos.setZ(i, z);
        }
        pos.needsUpdate = true;
        ribbon.rotation.y = Math.sin(time * 0.2 * speed + rIdx) * 0.25;
      });
    };
  } else if (theme === "particle-sphere") {
    const pCount = 1100;
    const geo = new THREE.BufferGeometry();
    disposables.push(geo);
    const pos = new Float32Array(pCount * 3);
    const origPos = new Float32Array(pCount * 3);
    const cols = new Float32Array(pCount * 3);

    const c1 = new THREE.Color(palette.primary);
    const c2 = new THREE.Color(palette.secondary);
    const c3 = new THREE.Color(palette.accent);

    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 9.5 + Math.random() * 2.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      const chosen = Math.random() > 0.5 ? c1 : Math.random() > 0.5 ? c2 : c3;
      cols[i * 3] = chosen.r;
      cols[i * 3 + 1] = chosen.g;
      cols[i * 3 + 2] = chosen.b;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(mat);

    const orb = new THREE.Points(geo, mat);
    sceneGroup.add(orb);

    const ringGeo = new THREE.TorusGeometry(15, 0.15, 16, 64);
    disposables.push(ringGeo);
    const ringMat = new THREE.MeshBasicMaterial({
      color: palette.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    disposables.push(ringMat);

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    sceneGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    sceneGroup.add(ring2);

    updateTheme = (time) => {
      const positions = geo.attributes.position.array as Float32Array;
      const pulse = Math.sin(time * 2 * speed) * 1.5;
      for (let i = 0; i < pCount; i++) {
        const factor = 1 + pulse * 0.1 + Math.sin(time * 3 * speed + i) * 0.05;
        positions[i * 3] = origPos[i * 3] * factor;
        positions[i * 3 + 1] = origPos[i * 3 + 1] * factor;
        positions[i * 3 + 2] = origPos[i * 3 + 2] * factor;
      }
      geo.attributes.position.needsUpdate = true;
      orb.rotation.y = time * 0.2 * speed;
      ring1.rotation.z = time * 0.15 * speed;
      ring2.rotation.x = time * 0.12 * speed;
    };
  } else if (theme === "cyber-grid") {
    const gridHelper = new THREE.GridHelper(80, 40, palette.primary, palette.secondary);
    gridHelper.position.y = -9;
    gridHelper.rotation.x = 0.05;
    sceneGroup.add(gridHelper);

    const sunGeo = new THREE.CircleGeometry(11, 32);
    disposables.push(sunGeo);
    const sunMat = new THREE.MeshBasicMaterial({
      color: palette.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    disposables.push(sunMat);
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 4, -22);
    sceneGroup.add(sun);

    const pyrGeo = new THREE.ConeGeometry(4.5, 8, 4);
    disposables.push(pyrGeo);
    const pyrMat = new THREE.MeshStandardMaterial({
      color: palette.accent,
      wireframe: true,
      emissive: palette.primary,
      emissiveIntensity: 0.55,
    });
    disposables.push(pyrMat);
    const pyramid = new THREE.Mesh(pyrGeo, pyrMat);
    pyramid.position.set(0, 0, 0);
    sceneGroup.add(pyramid);

    updateTheme = (time) => {
      gridHelper.position.z = (time * 6 * speed) % 2;
      sun.rotation.z = time * 0.1 * speed;
      pyramid.rotation.y = time * 0.8 * speed;
      pyramid.position.y = Math.sin(time * 1.5 * speed) * 1.8;
    };
  } else if (theme === "dna-helix") {
    const nodes = 110;
    const helixGroup = new THREE.Group();
    sceneGroup.add(helixGroup);

    const nodeGeo = new THREE.SphereGeometry(0.55, 12, 12);
    disposables.push(nodeGeo);
    const nodeMat1 = new THREE.MeshBasicMaterial({ color: palette.primary });
    const nodeMat2 = new THREE.MeshBasicMaterial({ color: palette.secondary });
    const barMat = new THREE.LineBasicMaterial({
      color: palette.accent,
      transparent: true,
      opacity: 0.45,
    });
    disposables.push(nodeMat1, nodeMat2, barMat);

    for (let i = 0; i < nodes; i++) {
      const t = (i / nodes) * Math.PI * 8;
      const y = (i - nodes / 2) * 0.7;
      const radius = 6.5;

      const x1 = Math.cos(t) * radius;
      const z1 = Math.sin(t) * radius;
      const s1 = new THREE.Mesh(nodeGeo, nodeMat1);
      s1.position.set(x1, y, z1);
      helixGroup.add(s1);

      const x2 = Math.cos(t + Math.PI) * radius;
      const z2 = Math.sin(t + Math.PI) * radius;
      const s2 = new THREE.Mesh(nodeGeo, nodeMat2);
      s2.position.set(x2, y, z2);
      helixGroup.add(s2);

      if (i % 2 === 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x1, y, z1),
          new THREE.Vector3(x2, y, z2),
        ]);
        disposables.push(lineGeo);
        const line = new THREE.Line(lineGeo, barMat);
        helixGroup.add(line);
      }
    }

    updateTheme = (time) => {
      helixGroup.rotation.y = time * 0.5 * speed;
      helixGroup.rotation.z = Math.sin(time * 0.3 * speed) * 0.15;
    };
  } else if (theme === "minimalist-torus") {
    const torusGeo1 = new THREE.TorusGeometry(8.5, 1.2, 24, 64);
    disposables.push(torusGeo1);
    const torusMat1 = new THREE.MeshStandardMaterial({
      color: palette.primary,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.95,
      emissive: palette.primary,
      emissiveIntensity: 0.25,
    });
    disposables.push(torusMat1);
    const torus1 = new THREE.Mesh(torusGeo1, torusMat1);
    sceneGroup.add(torus1);

    const torusGeo2 = new THREE.TorusGeometry(5.5, 0.8, 20, 48);
    disposables.push(torusGeo2);
    const torusMat2 = new THREE.MeshStandardMaterial({
      color: palette.secondary,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.95,
      emissive: palette.secondary,
      emissiveIntensity: 0.25,
    });
    disposables.push(torusMat2);
    const torus2 = new THREE.Mesh(torusGeo2, torusMat2);
    sceneGroup.add(torus2);

    const torusGeo3 = new THREE.TorusGeometry(3, 0.5, 16, 36);
    disposables.push(torusGeo3);
    const torusMat3 = new THREE.MeshStandardMaterial({
      color: palette.accent,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.95,
      emissive: palette.accent,
      emissiveIntensity: 0.25,
    });
    disposables.push(torusMat3);
    const torus3 = new THREE.Mesh(torusGeo3, torusMat3);
    sceneGroup.add(torus3);

    updateTheme = (time) => {
      torus1.rotation.x = time * 0.4 * speed;
      torus1.rotation.y = time * 0.3 * speed;
      torus2.rotation.y = -time * 0.6 * speed;
      torus2.rotation.z = time * 0.4 * speed;
      torus3.rotation.x = -time * 0.8 * speed;
      torus3.rotation.z = -time * 0.5 * speed;
    };
  } else if (theme === "quantum-matrix") {
    const count = 600;
    const geo = new THREE.BufferGeometry();
    disposables.push(geo);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.6,
      color: palette.primary,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(mat);
    const points = new THREE.Points(geo, mat);
    sceneGroup.add(points);

    const boxGeo = new THREE.BoxGeometry(4, 4, 4);
    disposables.push(boxGeo);
    const boxMat = new THREE.MeshStandardMaterial({
      color: palette.secondary,
      wireframe: true,
      emissive: palette.accent,
      emissiveIntensity: 0.4,
    });
    disposables.push(boxMat);
    const centralBox = new THREE.Mesh(boxGeo, boxMat);
    sceneGroup.add(centralBox);

    updateTheme = (time) => {
      points.rotation.y = time * 0.2 * speed;
      points.rotation.x = time * 0.1 * speed;
      centralBox.rotation.x = time * 0.5 * speed;
      centralBox.rotation.y = time * 0.7 * speed;
    };
  } else if (theme === "hypercube-tesseract") {
    const wireGeo = new THREE.BoxGeometry(10, 10, 10);
    disposables.push(wireGeo);
    const wireMat = new THREE.MeshBasicMaterial({
      color: palette.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    disposables.push(wireMat);
    const cube1 = new THREE.Mesh(wireGeo, wireMat);
    sceneGroup.add(cube1);

    const wireGeo2 = new THREE.BoxGeometry(6, 6, 6);
    disposables.push(wireGeo2);
    const wireMat2 = new THREE.MeshBasicMaterial({
      color: palette.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    disposables.push(wireMat2);
    const cube2 = new THREE.Mesh(wireGeo2, wireMat2);
    sceneGroup.add(cube2);

    updateTheme = (time) => {
      cube1.rotation.x = time * 0.4 * speed;
      cube1.rotation.y = time * 0.5 * speed;
      cube2.rotation.x = -time * 0.6 * speed;
      cube2.rotation.z = time * 0.5 * speed;
    };
  } else if (theme === "solar-system-orbit") {
    const sunGeo = new THREE.SphereGeometry(3.5, 24, 24);
    disposables.push(sunGeo);
    const sunMat = new THREE.MeshBasicMaterial({ color: palette.primary });
    disposables.push(sunMat);
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sceneGroup.add(sun);

    const orbitGroup = new THREE.Group();
    sceneGroup.add(orbitGroup);

    const planetGeo = new THREE.SphereGeometry(1.2, 16, 16);
    disposables.push(planetGeo);
    const planetMat = new THREE.MeshStandardMaterial({
      color: palette.secondary,
      emissive: palette.accent,
      emissiveIntensity: 0.5,
    });
    disposables.push(planetMat);
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.x = 12;
    orbitGroup.add(planet);

    const planet2Geo = new THREE.SphereGeometry(0.8, 16, 16);
    disposables.push(planet2Geo);
    const planet2Mat = new THREE.MeshStandardMaterial({
      color: palette.accent,
      emissive: palette.primary,
      emissiveIntensity: 0.5,
    });
    disposables.push(planet2Mat);
    const planet2 = new THREE.Mesh(planet2Geo, planet2Mat);
    planet2.position.z = -18;
    orbitGroup.add(planet2);

    updateTheme = (time) => {
      sun.rotation.y = time * 0.2 * speed;
      orbitGroup.rotation.y = time * 0.6 * speed;
      planet.rotation.y = time * 1.2 * speed;
    };
  } else if (theme === "neon-tunnel") {
    const rings: THREE.Mesh[] = [];
    const ringGeo = new THREE.TorusGeometry(12, 0.3, 16, 48);
    disposables.push(ringGeo);
    for (let i = 0; i < 12; i++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? palette.primary : palette.secondary,
        transparent: true,
        opacity: (12 - i) / 12,
      });
      disposables.push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = -i * 4;
      sceneGroup.add(ring);
      rings.push(ring);
    }

    updateTheme = (time) => {
      rings.forEach((ring, idx) => {
        ring.position.z += 0.05 * speed * 10;
        if (ring.position.z > 5) {
          ring.position.z = -40;
        }
        ring.rotation.z = time * 0.2 * speed + idx;
      });
    };
  } else if (theme === "firefly-swarm") {
    const count = 200;
    const geo = new THREE.BufferGeometry();
    disposables.push(geo);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 25;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 1.2,
      color: palette.accent,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(mat);
    const swarm = new THREE.Points(geo, mat);
    sceneGroup.add(swarm);

    updateTheme = (time) => {
      swarm.rotation.y = time * 0.05 * speed;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < count * 3; i += 3) {
        pos[i + 1] += Math.sin(time + i) * 0.02 * speed;
      }
      geo.attributes.position.needsUpdate = true;
    };
  } else if (theme === "rain-effect") {
    const count = 1500;
    const geo = new THREE.BufferGeometry();
    disposables.push(geo);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 60;
      positions[i + 2] = (Math.random() - 0.5) * 40;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(mat);
    const rain = new THREE.Points(geo, mat);
    sceneGroup.add(rain);

    updateTheme = (time) => {
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < count * 3; i += 3) {
        pos[i + 1] -= 0.5 * speed; // Rain falls down
        if (pos[i + 1] < -30) {
          pos[i + 1] = 30; // Reset to top
        }
      }
      geo.attributes.position.needsUpdate = true;
      rain.rotation.y = time * 0.05 * speed;
    };
  } else if (theme === "crystal-lattice") {
    const group = new THREE.Group();
    sceneGroup.add(group);
    const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
    disposables.push(sphereGeo);
    const matCrystal = new THREE.MeshStandardMaterial({
      color: palette.primary,
      roughness: 0.2,
      metalness: 0.9,
      emissive: palette.secondary,
      emissiveIntensity: 0.4,
    });
    disposables.push(matCrystal);

    for (let x = -2; x <= 2; x += 2) {
      for (let y = -2; y <= 2; y += 2) {
        const mesh = new THREE.Mesh(sphereGeo, matCrystal);
        mesh.position.set(x * 3, y * 3, Math.sin(x + y) * 3);
        group.add(mesh);
      }
    }

    updateTheme = (time) => {
      group.rotation.x = time * 0.3 * speed;
      group.rotation.y = time * 0.4 * speed;
    };
  } else if (theme === "snow-fall") {
    const count = 2000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 80;
      pos[i + 1] = (Math.random() - 0.5) * 60;
      pos[i + 2] = (Math.random() - 0.5) * 40;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const matSnow = new THREE.PointsMaterial({ size: 0.3, color: 0xffffff, transparent: true, opacity: 0.8 });
    const snow = new THREE.Points(geo, matSnow);
    sceneGroup.add(snow);
    updateTheme = (time) => {
      const positions = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < count * 3; i += 3) {
        positions[i + 1] -= 0.1 * speed;
        if (positions[i + 1] < -30) positions[i + 1] = 30;
      }
      geo.attributes.position.needsUpdate = true;
    };
  } else if (theme === "floating-bubbles") {
    const count = 100;
    const group = new THREE.Group();
    sceneGroup.add(group);
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(Math.random() * 0.5 + 0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.4 })
      );
      mesh.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*20);
      group.add(mesh);
    }
    updateTheme = (time) => {
      group.children.forEach((child, i) => {
        child.position.y += Math.sin(time + i) * 0.01 * speed;
      });
    };
  } else if (theme === "star-field") {
    const count = 5000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 100;
      pos[i + 1] = (Math.random() - 0.5) * 100;
      pos[i + 2] = (Math.random() - 0.5) * 100;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const matStars = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
    const stars = new THREE.Points(geo, matStars);
    sceneGroup.add(stars);
    updateTheme = (time) => {
      stars.rotation.y = time * 0.01 * speed;
    };
  }

  const resize = (newWidth: number, newHeight: number) => {
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
  };

  const dispose = () => {
    disposables.forEach((d) => {
      try {
        d.dispose();
      } catch (err) {}
    });
  };

  return {
    scene,
    camera,
    sceneGroup,
    update: updateTheme,
    resize,
    dispose,
  };
}
