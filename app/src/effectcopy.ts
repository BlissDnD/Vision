/* English effect copy keyed by persisted effect kind and parameter key. Never translate model keys. */
export interface ParamCopy { label: string; options?: string[] }
export interface EffectCopy { name: string; description: string; params: Record<string, ParamCopy> }
export const EFFECT_EN: Record<string, EffectCopy> = {
  "surface3d": {
    "name": "Spine surface",
    "description": "A real 3D surface built from an editable spine curve: a wide, thin, curved sheet with rounded edges, glossy or metallic material, studio lighting, and a reflective floor. It renders as a fast antialiased mesh. Animate the camera or orbit with O.",
    "params": {
      "arch": {
        "label": "Arc"
      },
      "width": {
        "label": "Width"
      },
      "thick": {
        "label": "Thickness"
      },
      "color": {
        "label": "Color"
      },
      "rough": {
        "label": "Roughness"
      },
      "metal": {
        "label": "Metalness"
      },
      "coat": {
        "label": "Clear coat"
      },
      "refl": {
        "label": "Floor reflection"
      },
      "expo": {
        "label": "Exposure (layer)"
      },
      "taper": {
        "label": "Taper"
      },
      "bend": {
        "label": "Crosswise bend"
      },
      "lean": {
        "label": "Initial droop"
      },
      "leanEnd": {
        "label": "Final droop"
      },
      "twist": {
        "label": "Twist amount"
      },
      "fillet": {
        "label": "Blend into floor"
      },
      "tint": {
        "label": "Red reflection"
      },
      "silver": {
        "label": "Silver rim"
      },
      "dot": {
        "label": "Dot pattern"
      },
      "dotS": {
        "label": "Point density (m)"
      },
      "stripPos": {
        "label": "Light streak position"
      },
      "stripSize": {
        "label": "Light streak size"
      },
      "stripI": {
        "label": "Light streak strength"
      },
      "backI": {
        "label": "Back light"
      },
      "sky": {
        "label": "Studio brightness"
      },
      "floor": {
        "label": "Floor",
        "options": [
          "None",
          "Reflective floor"
        ]
      },
      "bg": {
        "label": "Background",
        "options": [
          "Transparent",
          "Studio"
        ]
      },
      "blur": {
        "label": "Mirror blur"
      },
      "ao": {
        "label": "Contact shadow"
      },
      "ry": {
        "label": "Camera orbit (°)"
      },
      "rx": {
        "label": "Camera elevation (°)"
      },
      "dist": {
        "label": "Camera distance"
      },
      "fov": {
        "label": "Field of view (°)"
      },
      "tx": {
        "label": "Target X"
      },
      "ty": {
        "label": "Target Y"
      },
      "tz": {
        "label": "Target Z"
      }
    }
  },
  "terrain3d": {
    "name": "3D Terrain",
    "description": "A seeded 3D landscape with mountains, dunes, islands, canyons, plateaus or craters, plus water, sky and cast shadows. It responds to scene lighting. Use the die for a new variation; drag to orbit and scroll to zoom.",
    "params": {
      "ttype": {
        "label": "Terrain type",
        "options": [
          "Mountain",
          "Dune",
          "Island",
          "Canyon",
          "Plateau",
          "Crater"
        ]
      },
      "seed": {
        "label": "Core"
      },
      "style": {
        "label": "Style",
        "options": [
          "Moderate",
          "Desert",
          "Snowy",
          "Volcanic",
          "Alien"
        ]
      },
      "size": {
        "label": "Size (landscape extent)"
      },
      "relief": {
        "label": "Relief"
      },
      "detail": {
        "label": "Details"
      },
      "water": {
        "label": "Water level"
      },
      "bg": {
        "label": "Background",
        "options": [
          "Transparent",
          "Sky"
        ]
      },
      "fog": {
        "label": "Distance haze"
      },
      "expo": {
        "label": "Exposure (layer)"
      },
      "qual": {
        "label": "Quality",
        "options": [
          "Sketch",
          "Normal",
          "Detailed"
        ]
      },
      "ry": {
        "label": "Camera orbit (°)"
      },
      "rx": {
        "label": "Camera elevation (°)"
      },
      "dist": {
        "label": "Camera distance"
      },
      "fov": {
        "label": "Field of view (°)"
      },
      "tx": {
        "label": "Target X"
      },
      "ty": {
        "label": "Target Y"
      },
      "tz": {
        "label": "Target Z"
      }
    }
  },
  "obj3d": {
    "name": "3D object",
    "description": "A PBR 3D object with environment lighting, soft shadows, ambient occlusion and surface texture. Drag with the 3D Orbit tool (O) to inspect it.",
    "params": {
      "shape": {
        "label": "Shape",
        "options": [
          "Sphere",
          "Torus",
          "Cube",
          "Octahedron",
          "Merkaba",
          "Gyroid sphere",
          "Torus knot",
          "Dodecahedron",
          "Icosahedron",
          "Metaballs"
        ]
      },
      "material": {
        "label": "Material",
        "options": [
          "Iridescent",
          "Plasma",
          "Planet",
          "Hologram",
          "Chrome",
          "Lava",
          "Glass",
          "Normal colors",
          "Toon",
          "Clay",
          "Mother of pearl",
          "Velvet"
        ]
      },
      "reflM": {
        "label": "Reflection",
        "options": [
          "Environment",
          "Real (scene)"
        ]
      },
      "floorM": {
        "label": "Floor",
        "options": [
          "Shadow",
          "Mirror"
        ]
      },
      "mirror": {
        "label": "Floor mirror strength"
      },
      "env": {
        "label": "Environment",
        "options": [
          "Studio",
          "Sunset",
          "Cosmic",
          "Neon"
        ]
      },
      "rough": {
        "label": "Roughness"
      },
      "metal": {
        "label": "Metalness"
      },
      "detail": {
        "label": "Surface texture"
      },
      "floor": {
        "label": "Ground shadow"
      },
      "glow": {
        "label": "Rim lighting"
      },
      "aa": {
        "label": "Antialiasing",
        "options": [
          "Fast",
          "4× (slower)"
        ]
      },
      "displace": {
        "label": "Distortion"
      },
      "spin": {
        "label": "Rotation"
      },
      "rx": {
        "label": "Tilt °"
      },
      "ry": {
        "label": "Rotation °"
      },
      "twist": {
        "label": "Twist"
      },
      "ring": {
        "label": "Ring"
      },
      "speed": {
        "label": "Material tempo"
      },
      "sceneL": {
        "label": "Affected by scene lighting",
        "options": [
          "No",
          "Yes"
        ]
      }
    }
  },
  "gyroid": {
    "name": "Gyroid cave",
    "description": "An endless 3D passage with glowing membrane walls and forward camera motion.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "scale": {
        "label": "Density"
      },
      "thick": {
        "label": "Wall thickness"
      },
      "roll": {
        "label": "Rolling"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "inksketch": {
    "name": "Ink sketch",
    "description": "An Appearance for 3D objects that resembles ballpoint hatching on paper. Dark areas gain denser crosshatching; contours and ground shadows are also sketched. It overrides the material and fades in with Strength.",
    "params": {
      "ink": {
        "label": "Ink color"
      },
      "paper": {
        "label": "Paper"
      },
      "density": {
        "label": "Density"
      },
      "width": {
        "label": "Line width"
      },
      "press": {
        "label": "Pressure"
      },
      "contour": {
        "label": "Contour"
      },
      "boil": {
        "label": "Living line (draw/s)"
      },
      "orig": {
        "label": "Original color"
      },
      "angle": {
        "label": "Hatching angle °"
      },
      "paperbg": {
        "label": "Paper background",
        "options": [
          "No",
          "Yes"
        ]
      }
    }
  },
  "hologram": {
    "name": "Hologram",
    "description": "An Appearance for 3D objects: a translucent body with glowing edges, moving scanlines, light bands, flicker and occasional image displacement. It overrides the material and fades in with Strength.",
    "params": {
      "color": {
        "label": "Color"
      },
      "alpha": {
        "label": "Opacity"
      },
      "rim": {
        "label": "Edge sharpness"
      },
      "lines": {
        "label": "Streak density"
      },
      "scan": {
        "label": "Pan tempo"
      },
      "flick": {
        "label": "Flicker"
      },
      "glitch": {
        "label": "Offset"
      },
      "band": {
        "label": "Light band"
      }
    }
  },
  "pathshape": {
    "name": "Path",
    "description": "Draw an editable line on the canvas and drag its points. Double-click near the line to add a point; Alt-click to remove one. Motion and Particle Source can reuse the same path. Draw-on animation and closed filled masks are also available.",
    "params": {
      "look": {
        "label": "Look",
        "options": [
          "Line",
          "Tube",
          "Twisted ribbon",
          "Neon",
          "String of pearls"
        ]
      },
      "width": {
        "label": "Thickness"
      },
      "w0": {
        "label": "Start thickness (×)"
      },
      "w1": {
        "label": "End thickness (×)"
      },
      "color": {
        "label": "Color",
        "options": [
          "Custom color",
          "Gradient",
          "Across palette"
        ]
      },
      "c1": {
        "label": "Color"
      },
      "c2": {
        "label": "Second color"
      },
      "trimS": {
        "label": "Draw start"
      },
      "trimE": {
        "label": "Draw end"
      },
      "trimO": {
        "label": "Draw offset"
      },
      "dash": {
        "label": "Dashes",
        "options": [
          "None",
          "Dashed",
          "Dotted"
        ]
      },
      "dashL": {
        "label": "Dash length"
      },
      "closed": {
        "label": "Line",
        "options": [
          "Open",
          "Closed"
        ]
      },
      "smooth": {
        "label": "Corners",
        "options": [
          "Smooth curve",
          "Angular"
        ]
      },
      "fill": {
        "label": "Fill (closed path)",
        "options": [
          "None",
          "Custom color"
        ]
      },
      "fillc": {
        "label": "Fill color"
      },
      "wave": {
        "label": "Rippling"
      },
      "wfreq": {
        "label": "Wave count"
      },
      "wspeed": {
        "label": "Wave speed"
      },
      "twist": {
        "label": "Ribbon twist"
      },
      "gloss": {
        "label": "Glint"
      },
      "glow": {
        "label": "Glow (neon)"
      }
    }
  },
  "shape": {
    "name": "Shape",
    "description": "A vector shape that can also act as a mask. Put a source above it and enable Clip to layer below on the source.",
    "params": {
      "kind": {
        "label": "Shape",
        "options": [
          "Circle",
          "Ring",
          "Rectangle",
          "Polygon",
          "Star",
          "Crescent",
          "Vesica",
          "Heart",
          "Flower",
          "Spiral",
          "Eye",
          "Cross",
          "Infinity",
          "Hill silhouette"
        ]
      },
      "size": {
        "label": "Size"
      },
      "soft": {
        "label": "Softness"
      },
      "fill": {
        "label": "Fill",
        "options": [
          "Color",
          "Palette",
          "Rainbow"
        ]
      },
      "color": {
        "label": "Color"
      },
      "aspect": {
        "label": "Ratio"
      },
      "round": {
        "label": "Roundness"
      },
      "sides": {
        "label": "Sides / points"
      },
      "inner": {
        "label": "Inner ratio"
      },
      "thick": {
        "label": "Ring thickness"
      },
      "outline": {
        "label": "Outline"
      },
      "speed": {
        "label": "Color motion"
      }
    }
  },
  "plasma": {
    "name": "Plasma",
    "description": "A soft, undulating field of color.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "zoom": {
        "label": "Zoom"
      },
      "warp": {
        "label": "Swirl"
      },
      "bands": {
        "label": "Bands"
      }
    }
  },
  "fire": {
    "name": "Fire",
    "description": "Flames rising from the bottom. Palette coloring adapts them to the selected colors.",
    "params": {
      "height": {
        "label": "Height"
      },
      "intensity": {
        "label": "Force"
      },
      "speed": {
        "label": "Speed"
      },
      "tint": {
        "label": "Palette coloring"
      },
      "width": {
        "label": "Width"
      },
      "turb": {
        "label": "Turbulence"
      }
    }
  },
  "aurora": {
    "name": "Aurora",
    "description": "Moving curtains of light against a night sky.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "height": {
        "label": "Height"
      },
      "spread": {
        "label": "Layer spacing"
      },
      "glow": {
        "label": "Light"
      },
      "stars": {
        "label": "Stars"
      }
    }
  },
  "nebula": {
    "name": "Nebula",
    "description": "A swirling cloud with twinkling stars.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "zoom": {
        "label": "Zoom"
      },
      "warp": {
        "label": "Swirl"
      },
      "bright": {
        "label": "Brightness"
      },
      "stars": {
        "label": "Stars"
      }
    }
  },
  "liquid": {
    "name": "Liquid marble",
    "description": "An oily flow that curls back into itself.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "zoom": {
        "label": "Zoom"
      },
      "warp": {
        "label": "Distortion"
      },
      "bands": {
        "label": "Bands"
      }
    }
  },
  "tunnel": {
    "name": "Wormhole",
    "description": "An infinite space-time tunnel with twisting rings.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "twist": {
        "label": "Twist"
      },
      "rings": {
        "label": "Rings"
      },
      "segments": {
        "label": "Segments"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "sacred": {
    "name": "Sacred geometry",
    "description": "Flower-of-life circles, interlocking triangles and pulsing rings.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "radius": {
        "label": "Radius"
      },
      "sides": {
        "label": "Polygon sides"
      },
      "layers": {
        "label": "Ring layers"
      },
      "width": {
        "label": "Line width"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "kali": {
    "name": "Fractal flower",
    "description": "A kaleidoscopic fractal with deepening tendrils.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "zoom": {
        "label": "Zoom"
      },
      "morph": {
        "label": "Shape"
      },
      "iter": {
        "label": "Depth"
      },
      "sharp": {
        "label": "Sharpness"
      },
      "spin": {
        "label": "Twist"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "julia": {
    "name": "Julia portal",
    "description": "A continuously changing Julia set.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "radius": {
        "label": "Parameter"
      },
      "iter": {
        "label": "Iterations"
      },
      "bands": {
        "label": "Color bands"
      },
      "core": {
        "label": "Core glow"
      }
    }
  },
  "moire": {
    "name": "Interference",
    "description": "A moiré pattern made from moving wave sources.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "sep": {
        "label": "Source spacing"
      },
      "freq": {
        "label": "Frequency"
      },
      "sharp": {
        "label": "Contrast"
      }
    }
  },
  "hyper": {
    "name": "Hyperspace",
    "description": "Star streaks moving at lightspeed.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "count": {
        "label": "Density"
      },
      "streak": {
        "label": "Streak length"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "grid": {
    "name": "Hologram grid",
    "description": "An infinite sci-fi grid under a striped sun.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "horizon": {
        "label": "Horizon"
      },
      "density": {
        "label": "Grid density"
      },
      "sun": {
        "label": "Sun"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "blackhole": {
    "name": "Event horizon",
    "description": "A black hole with an accretion disk and light bending.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "size": {
        "label": "Size"
      },
      "lens": {
        "label": "Lens effect"
      },
      "tilt": {
        "label": "Tilt"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "gradient": {
    "name": "Gradient",
    "description": "A slowly shifting background color drawn from the palette.",
    "params": {
      "mode": {
        "label": "Type",
        "options": [
          "Linear",
          "Radial"
        ]
      },
      "span": {
        "label": "Extent"
      },
      "speed": {
        "label": "Speed"
      }
    }
  },
  "galaxy": {
    "name": "Galaxy",
    "description": "A spiral galaxy with differential rotation and stardust.",
    "params": {
      "branches": {
        "label": "Arms"
      },
      "twist": {
        "label": "Twist amount"
      },
      "density": {
        "label": "Density"
      },
      "core": {
        "label": "Core glow"
      },
      "speed": {
        "label": "Rotation"
      },
      "radius": {
        "label": "Spread"
      }
    }
  },
  "waves": {
    "name": "Particle wave",
    "description": "A perspective field of points moving like an ocean.",
    "params": {
      "amp": {
        "label": "Rippling"
      },
      "density": {
        "label": "Density"
      },
      "speed": {
        "label": "Speed"
      },
      "dot": {
        "label": "Point size"
      },
      "freq": {
        "label": "Wavelength"
      },
      "height": {
        "label": "Camera height"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "lava": {
    "name": "Lava lamp",
    "description": "Slowly merging, floating metaball drops on a transparent background.",
    "params": {
      "count": {
        "label": "Drops"
      },
      "size": {
        "label": "Size"
      },
      "speed": {
        "label": "Speed"
      },
      "soft": {
        "label": "Softness"
      },
      "glow": {
        "label": "Rim lighting"
      }
    }
  },
  "cells": {
    "name": "Cellular fabric",
    "description": "Living Voronoi cells with glowing borders.",
    "params": {
      "zoom": {
        "label": "Cell size"
      },
      "speed": {
        "label": "Speed"
      },
      "glow": {
        "label": "Edge light"
      },
      "fill": {
        "label": "Cell fill"
      },
      "width": {
        "label": "Edge thickness"
      },
      "variety": {
        "label": "Color variation"
      }
    }
  },
  "flare": {
    "name": "Lens flare",
    "description": "A light source with rays, an anamorphic streak and ghost images. Drag it to place the light.",
    "params": {
      "size": {
        "label": "Brightness"
      },
      "rays": {
        "label": "Rays"
      },
      "streak": {
        "label": "Anamorphic streak"
      },
      "ghosts": {
        "label": "Ghost images"
      },
      "ring": {
        "label": "Halo"
      },
      "flicker": {
        "label": "Vibration"
      }
    }
  },
  "text": {
    "name": "Text",
    "description": "Text with palette shimmer and glow. Supports multiple lines and left, center or right alignment.",
    "params": {
      "tint": {
        "label": "Coloring"
      },
      "glow": {
        "label": "Glow"
      },
      "spread": {
        "label": "Color spread"
      },
      "shimmer": {
        "label": "Sparkle"
      }
    }
  },
  "image": {
    "name": "Image",
    "description": "Your image as a layer: photo, logo or texture. The Frame control crops it to a rounded rectangle of a chosen size.",
    "params": {
      "bright": {
        "label": "Brightness"
      },
      "sat": {
        "label": "Saturation"
      },
      "fw": {
        "label": "Frame width (0 = none)"
      },
      "fh": {
        "label": "Frame height"
      },
      "ox": {
        "label": "Crop X"
      },
      "oy": {
        "label": "Crop Y"
      },
      "round": {
        "label": "Corner"
      }
    }
  },
  "lottie": {
    "name": "Vector animation",
    "description": "An imported Lottie animation. Media start, speed and Loop are independent of keyframe animation.",
    "params": {
      "bright": {
        "label": "Brightness"
      },
      "sat": {
        "label": "Saturation"
      }
    }
  },
  "custom": {
    "name": "Custom GLSL",
    "description": "Write a live shader. IN(uv) samples the image beneath it, so it can also be a filter.",
    "params": {
      "a": {
        "label": "p_a"
      },
      "b": {
        "label": "p_b"
      },
      "c": {
        "label": "p_c"
      },
      "d": {
        "label": "p_d"
      }
    }
  },
  "blur": {
    "name": "Blur",
    "description": "A soft Gaussian blur. Applied to a shape, it creates a soft-edged mask.",
    "params": {
      "radius": {
        "label": "Strength"
      }
    }
  },
  "glow": {
    "name": "Glow",
    "description": "A soft two-pass Gaussian glow that spreads bright areas.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "radius": {
        "label": "Radius"
      },
      "thresh": {
        "label": "Threshold"
      }
    }
  },
  "lens": {
    "name": "Space-time warp",
    "description": "Gravitational lensing and ripples around the layer center. Drag the layer to position the distortion.",
    "params": {
      "mass": {
        "label": "Mass"
      },
      "ripple": {
        "label": "Gravitational wave"
      },
      "hole": {
        "label": "Black core"
      },
      "ring": {
        "label": "Ring glow"
      },
      "waves": {
        "label": "Wave density"
      },
      "speed": {
        "label": "Speed"
      }
    }
  },
  "kaleido": {
    "name": "Kaleidoscope",
    "description": "Splits the image below into mirrored slices.",
    "params": {
      "segments": {
        "label": "Slices"
      },
      "spin": {
        "label": "Spin"
      },
      "zoom": {
        "label": "Zoom"
      },
      "angle": {
        "label": "Angle"
      },
      "shift": {
        "label": "Sample offset"
      }
    }
  },
  "feedback": {
    "name": "Echo",
    "description": "A feedback loop that scales and rotates the previous frame back into the image, creating long trails.",
    "params": {
      "decay": {
        "label": "Decay"
      },
      "zoom": {
        "label": "Zoom"
      },
      "rot": {
        "label": "Rotation"
      },
      "drift": {
        "label": "Color drift"
      },
      "wobble": {
        "label": "Shake"
      },
      "mode": {
        "label": "Mode",
        "options": [
          "Bright",
          "Blend"
        ]
      }
    }
  },
  "swirl": {
    "name": "Swirl",
    "description": "Twists the image around its center.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "radius": {
        "label": "Radius"
      },
      "speed": {
        "label": "Spin"
      }
    }
  },
  "warp": {
    "name": "Organic distortion",
    "description": "Moves the image with noise. On a mask it creates living, breathing edges.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "scale": {
        "label": "Scale"
      },
      "speed": {
        "label": "Speed"
      }
    }
  },
  "ripple": {
    "name": "Ripple",
    "description": "Concentric or water-like distortion waves.",
    "params": {
      "mode": {
        "label": "Type",
        "options": [
          "Radial",
          "Water surface"
        ]
      },
      "amount": {
        "label": "Strength"
      },
      "freq": {
        "label": "Frequency"
      },
      "speed": {
        "label": "Speed"
      }
    }
  },
  "radial": {
    "name": "Light rays",
    "description": "Rays emitted from bright regions near the center.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "length": {
        "label": "Length"
      },
      "thresh": {
        "label": "Threshold"
      }
    }
  },
  "edge": {
    "name": "Neon outline",
    "description": "Draws a glowing line around shape edges, especially effective on shapes and text.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "width": {
        "label": "Thickness"
      },
      "only": {
        "label": "Line only"
      },
      "speed": {
        "label": "Color motion"
      }
    }
  },
  "mirror": {
    "name": "Mirror",
    "description": "Reflects the image in two, four or eight-way symmetry.",
    "params": {
      "mode": {
        "label": "Symmetry",
        "options": [
          "Left-right",
          "Top-bottom",
          "Fourfold",
          "Eightfold"
        ]
      }
    }
  },
  "polar": {
    "name": "Polar space",
    "description": "Wraps the image below around a circle or into a tunnel.",
    "params": {
      "mode": {
        "label": "Type",
        "options": [
          "Around",
          "Tunnel"
        ]
      },
      "zoom": {
        "label": "Zoom"
      },
      "repeat": {
        "label": "Repeat"
      },
      "speed": {
        "label": "Speed"
      },
      "spin": {
        "label": "Spin"
      }
    }
  },
  "chroma": {
    "name": "Chromatic aberration",
    "description": "Offsets the RGB channels from one another.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "wobble": {
        "label": "Pulse"
      },
      "radial": {
        "label": "Direction",
        "options": [
          "Horizontal",
          "Radial"
        ]
      }
    }
  },
  "psycolor": {
    "name": "Psychedelic color",
    "description": "Maps image brightness across the palette.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "cycles": {
        "label": "Cycles"
      },
      "speed": {
        "label": "Speed"
      }
    }
  },
  "grade": {
    "name": "Color grading",
    "description": "Adjust hue, saturation, contrast and brightness.",
    "params": {
      "sat": {
        "label": "Saturation"
      },
      "contrast": {
        "label": "Contrast"
      },
      "bright": {
        "label": "Brightness"
      },
      "hshift": {
        "label": "Hue"
      },
      "invert": {
        "label": "Invert"
      }
    }
  },
  "glitch": {
    "name": "Glitch",
    "description": "Adds stripe displacement, RGB tearing and pixelation.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "rate": {
        "label": "Rate"
      },
      "pixel": {
        "label": "Pixel size"
      },
      "blocks": {
        "label": "Band size"
      }
    }
  },
  "film": {
    "name": "Film grain",
    "description": "Adds film grain, scanlines and vignette.",
    "params": {
      "grain": {
        "label": "Grain"
      },
      "vig": {
        "label": "Vignette"
      },
      "scan": {
        "label": "Scanlines"
      }
    }
  },
  "crt": {
    "name": "CRT screen",
    "description": "An old television look with curved glass, rounded corners, scanlines, an RGB mask and subtle flicker. Apply to text, images, groups or the entire scene.",
    "params": {
      "curve": {
        "label": "Curvature"
      },
      "scan": {
        "label": "Scanlines"
      },
      "rgb": {
        "label": "RGB offset"
      },
      "lines": {
        "label": "Row count"
      },
      "mask": {
        "label": "RGB mask"
      },
      "grain": {
        "label": "Noise"
      },
      "vig": {
        "label": "Vignette"
      },
      "corner": {
        "label": "Corner roundness"
      },
      "flick": {
        "label": "Flicker"
      }
    }
  },
  "castlight": {
    "name": "Colored cast light",
    "description": "A long colored light trail or shadow behind letters and shapes. It follows their outline while keeping the background transparent.",
    "params": {
      "angle": {
        "label": "Direction"
      },
      "len": {
        "label": "Length"
      },
      "amount": {
        "label": "Strength"
      },
      "fade": {
        "label": "Decay"
      },
      "c1": {
        "label": "Color (near)"
      },
      "c2": {
        "label": "Color (far)"
      }
    }
  },
  "texture": {
    "name": "Texture",
    "description": "Adds a tactile surface to the image: paper, canvas, dust and scratches, rock or fine noise.",
    "params": {
      "mode": {
        "label": "Material",
        "options": [
          "Paper",
          "Canvas",
          "Dust and scratches",
          "Rock",
          "Fine noise"
        ]
      },
      "amount": {
        "label": "Strength"
      },
      "scale": {
        "label": "Scale"
      },
      "anim": {
        "label": "Motion"
      }
    }
  },
  "blob": {
    "name": "Blob tracking",
    "description": "Finds bright, dark, moving or colored regions of the image below and draws HUD markers, lines and labels. Drag onto one layer to track only that layer.",
    "params": {
      "source": {
        "label": "Follow target",
        "options": [
          "Brightness",
          "Darkness",
          "Motion",
          "Colorfulness",
          "Random points"
        ]
      },
      "detect": {
        "label": "Sampling",
        "options": [
          "Patches",
          "Vertices"
        ]
      },
      "thresh": {
        "label": "Threshold"
      },
      "count": {
        "label": "Count"
      },
      "spacing": {
        "label": "Point spacing"
      },
      "minarea": {
        "label": "Minimum patch size"
      },
      "res": {
        "label": "Sampling resolution"
      },
      "smooth": {
        "label": "Smoothing"
      },
      "persist": {
        "label": "Hold (frames)"
      },
      "wander": {
        "label": "Random motion"
      },
      "style": {
        "label": "Marker",
        "options": [
          "Frame",
          "Corners",
          "Circle",
          "Crosshair",
          "Point",
          "Diamond",
          "None"
        ]
      },
      "color": {
        "label": "Color"
      },
      "colormode": {
        "label": "Coloring",
        "options": [
          "Solid color",
          "Palette",
          "Color cycling"
        ]
      },
      "sizemode": {
        "label": "Size",
        "options": [
          "By patch",
          "Fixed"
        ]
      },
      "box": {
        "label": "Box size"
      },
      "sizemul": {
        "label": "Size multiplier"
      },
      "width": {
        "label": "Line width"
      },
      "fill": {
        "label": "Fill"
      },
      "dash": {
        "label": "Line",
        "options": [
          "Continuous",
          "Dashed"
        ]
      },
      "guides": {
        "label": "Guide lines",
        "options": [
          "Out",
          "In"
        ]
      },
      "jitter": {
        "label": "Shake"
      },
      "flicker": {
        "label": "Flashing"
      },
      "link": {
        "label": "Connect",
        "options": [
          "None",
          "Chain",
          "Nearest",
          "Network",
          "To center"
        ]
      },
      "nearest": {
        "label": "Neighbor count"
      },
      "linkdist": {
        "label": "Network spacing"
      },
      "curve": {
        "label": "Curvature"
      },
      "linkalpha": {
        "label": "Line strength"
      },
      "label": {
        "label": "Caption",
        "options": [
          "None",
          "ID",
          "Coordinates",
          "Pixel",
          "Size",
          "Hex",
          "Custom template",
          "ID + coordinates"
        ]
      },
      "fsize": {
        "label": "Font size"
      },
      "font": {
        "label": "Font",
        "options": [
          "Mono",
          "Sans",
          "Orbitron",
          "Major Mono"
        ]
      },
      "tag": {
        "label": "Style",
        "options": [
          "Text",
          "Label"
        ]
      },
      "scramble": {
        "label": "Character blend"
      },
      "inside": {
        "label": "Effect",
        "options": [
          "None",
          "Invert",
          "Pixelation",
          "Thermal camera",
          "Color inversion",
          "Black and white",
          "Highlight",
          "Blur"
        ]
      },
      "inamt": {
        "label": "Strength"
      },
      "pix": {
        "label": "Pixel / blur size"
      }
    }
  },
  "ascii": {
    "name": "ASCII",
    "description": "Recreates the image below using text characters.",
    "params": {
      "size": {
        "label": "Character size"
      },
      "mode": {
        "label": "Color",
        "options": [
          "Original",
          "Palette",
          "Matrix green",
          "White"
        ]
      },
      "contrast": {
        "label": "Contrast"
      },
      "invert": {
        "label": "Direction",
        "options": [
          "Normal",
          "Reversed"
        ]
      },
      "bg": {
        "label": "Background image"
      }
    }
  },
  "halftone": {
    "name": "Halftone",
    "description": "Print-style raster dots in color, RGB or newsprint modes.",
    "params": {
      "size": {
        "label": "Halftone size"
      },
      "mode": {
        "label": "Style",
        "options": [
          "Colored dots",
          "RGB raster",
          "Newsprint"
        ]
      },
      "angle": {
        "label": "Angle"
      },
      "scale": {
        "label": "Dot size"
      }
    }
  },
  "pixelart": {
    "name": "Pixel art",
    "description": "Retro pixel graphics with fewer color levels and Bayer dithering.",
    "params": {
      "size": {
        "label": "Pixel size"
      },
      "levels": {
        "label": "Color levels"
      },
      "dither": {
        "label": "Dithering"
      },
      "mode": {
        "label": "Colors",
        "options": [
          "Original",
          "Palette"
        ]
      }
    }
  },
  "planet": {
    "name": "Planet",
    "description": "A planet studio with seven types, atmospheric glow, rotating clouds, city lights and shadowed rings. Use the die next to Seed to create a new planet.",
    "params": {
      "ptype": {
        "label": "Type",
        "options": [
          "Rocky",
          "Ocean",
          "Gas giant",
          "Ice",
          "Lava",
          "Desert",
          "Forest"
        ]
      },
      "seed": {
        "label": "Core"
      },
      "radius": {
        "label": "Size"
      },
      "sunang": {
        "label": "Sun direction °"
      },
      "sunh": {
        "label": "Sun elevation"
      },
      "atmo": {
        "label": "Atmosphere"
      },
      "atmocol": {
        "label": "Atmosphere color"
      },
      "clouds": {
        "label": "Cloud cover"
      },
      "cloudspeed": {
        "label": "Cloud wind"
      },
      "lights": {
        "label": "City lights"
      },
      "ring": {
        "label": "Ring"
      },
      "ringtilt": {
        "label": "Ring tilt °"
      },
      "spin": {
        "label": "Rotation"
      },
      "tilt": {
        "label": "Axial tilt °"
      },
      "craters": {
        "label": "Craters / storms"
      },
      "detail": {
        "label": "Relief scale"
      },
      "tint": {
        "label": "Palette coloring"
      },
      "part": {
        "label": "Layer",
        "options": [
          "Whole planet",
          "Surface only",
          "Cloud shell only",
          "Atmosphere only",
          "Ring only · back half",
          "Ring only · front half"
        ]
      }
    }
  },
  "sky": {
    "name": "Sky",
    "description": "A sky studio with time-of-day color, cloud types, hills, haze and light rays.",
    "params": {
      "ctype": {
        "label": "Clouds",
        "options": [
          "Billowing",
          "Veil",
          "Layer",
          "Storm"
        ]
      },
      "seed": {
        "label": "Core"
      },
      "sunh": {
        "label": "Time of day (sun elevation)"
      },
      "sunx": {
        "label": "Sun horizontal position"
      },
      "cover": {
        "label": "Coverage"
      },
      "cscale": {
        "label": "Cloud size"
      },
      "wind": {
        "label": "Wind"
      },
      "hills": {
        "label": "Hills"
      },
      "hillh": {
        "label": "Horizon"
      },
      "grass": {
        "label": "Grass color"
      },
      "haze": {
        "label": "Haze"
      },
      "rays": {
        "label": "Light rays"
      }
    }
  },
  "space": {
    "name": "Space",
    "description": "An interstellar landscape base with depth-layered stars, Milky Way dust, nebulae and bright stars with diffraction spikes.",
    "params": {
      "seed": {
        "label": "Core"
      },
      "stars": {
        "label": "Stars"
      },
      "mw": {
        "label": "Milky Way"
      },
      "mwtilt": {
        "label": "Milky Way tilt °"
      },
      "dust": {
        "label": "Dust bands"
      },
      "nebula": {
        "label": "Fog"
      },
      "bright": {
        "label": "Bright stars"
      },
      "twinkle": {
        "label": "Twinkle"
      },
      "drift": {
        "label": "Drift"
      }
    }
  },
  "bokeh": {
    "name": "Bokeh",
    "description": "Soft circles of light on a dark background for a cinematic or product-film look.",
    "params": {
      "count": {
        "label": "Count"
      },
      "size": {
        "label": "Size"
      },
      "soft": {
        "label": "Softness"
      },
      "bright": {
        "label": "Brightness"
      },
      "speed": {
        "label": "Drift"
      }
    }
  },
  "skygrad": {
    "name": "Sky color",
    "description": "A time-of-day sky gradient from zenith to horizon, dusk and night. Sun, Clouds, Ground and Haze share Time of day and Horizon values so they can move together.",
    "params": {
      "sunh": {
        "label": "Time of day (sun elevation)"
      },
      "sunx": {
        "label": "Sun horizontal position"
      },
      "hz": {
        "label": "Horizon"
      },
      "glow": {
        "label": "Sun halo"
      },
      "sat": {
        "label": "Saturation"
      }
    }
  },
  "sun": {
    "name": "Sun",
    "description": "A glowing orb with corona. It shares Time of day and Horizon with Sky color. Add Lens flare or Light rays above it.",
    "params": {
      "sunh": {
        "label": "Time of day"
      },
      "sunx": {
        "label": "Horizontally"
      },
      "hz": {
        "label": "Horizon"
      },
      "size": {
        "label": "Disc size"
      },
      "corona": {
        "label": "Corona"
      },
      "bright": {
        "label": "Brightness"
      },
      "cmode": {
        "label": "Color",
        "options": [
          "From time of day",
          "Custom"
        ]
      },
      "color": {
        "label": "Custom color"
      },
      "horizon": {
        "label": "Sets below horizon",
        "options": [
          "No",
          "Yes"
        ]
      },
      "rays": {
        "label": "Rays"
      },
      "seed": {
        "label": "Ray pattern"
      }
    }
  },
  "clouds": {
    "name": "Cloud layer",
    "description": "Cumulus, wispy, layered or storm clouds lit from the sun's direction. Place them above the horizon in perspective or flat anywhere. Use the die beside Seed for new clouds.",
    "params": {
      "ctype": {
        "label": "Clouds",
        "options": [
          "Billowing",
          "Veil",
          "Layer",
          "Storm"
        ]
      },
      "seed": {
        "label": "Core"
      },
      "cover": {
        "label": "Coverage"
      },
      "persp": {
        "label": "View",
        "options": [
          "Perspective",
          "Flat"
        ]
      },
      "cscale": {
        "label": "Cloud size"
      },
      "sunh": {
        "label": "Time of day"
      },
      "sunx": {
        "label": "Sun horizontal position"
      },
      "hz": {
        "label": "Horizon"
      },
      "wind": {
        "label": "Wind"
      },
      "bright": {
        "label": "Brightness"
      },
      "soft": {
        "label": "Softness"
      }
    }
  },
  "terrain": {
    "name": "Ground",
    "description": "A grassy, dry, sandy, rocky or snowy surface in perspective. Clip it to a hill silhouette to show ground only within the hill shape.",
    "params": {
      "ttype": {
        "label": "Surface",
        "options": [
          "Grass",
          "Dry grass",
          "Sand",
          "Rock",
          "Snow"
        ]
      },
      "color": {
        "label": "Color"
      },
      "sunh": {
        "label": "Time of day"
      },
      "hz": {
        "label": "Horizon"
      },
      "detail": {
        "label": "Detail"
      },
      "shade": {
        "label": "Relief"
      },
      "seed": {
        "label": "Core"
      },
      "wind": {
        "label": "Wind in grass"
      }
    }
  },
  "haze": {
    "name": "Haze",
    "description": "Atmospheric haze near the horizon and ground fog. Place it between landscape layers to push lower layers farther away.",
    "params": {
      "amount": {
        "label": "Strength"
      },
      "hz": {
        "label": "Horizon"
      },
      "spread": {
        "label": "Spread"
      },
      "low": {
        "label": "Ground fog"
      },
      "sunh": {
        "label": "Time of day"
      },
      "sunx": {
        "label": "Sun horizontal position"
      },
      "cmode": {
        "label": "Color",
        "options": [
          "From sky color",
          "Custom"
        ]
      },
      "color": {
        "label": "Custom color"
      }
    }
  },
  "mtext": {
    "name": "Animated text",
    "description": "Kinetic typography by letter or word: blur-to-focus, rise, masked slides, spring bounce, scale/focus pop and hard cuts. Boil, motion stretch and beat pulse can accompany any gesture.",
    "params": {
      "anim": {
        "label": "Gesture",
        "options": [
          "Focus from blur",
          "Rise",
          "Masked slide up",
          "Bounce",
          "Typing",
          "Scatter",
          "Wave",
          "Scale and focus pop",
          "Hard cut",
          "Spring jump",
          "Masked slide from side",
          "Masked reveal from center"
        ]
      },
      "unit": {
        "label": "Unit",
        "options": [
          "Letter",
          "Word",
          "Line"
        ]
      },
      "order": {
        "label": "Order",
        "options": [
          "From left",
          "From right",
          "From center",
          "Random"
        ]
      },
      "start": {
        "label": "Start (s)"
      },
      "dur": {
        "label": "Duration (s)"
      },
      "stagger": {
        "label": "Delay per unit (0 = together)"
      },
      "outAt": {
        "label": "Exit (s, 0 = none)"
      },
      "ease": {
        "label": "Curve",
        "options": [
          "Soft",
          "Strong",
          "Spring (legacy)",
          "Out-in",
          "Linear",
          "Spring · subtle",
          "Spring · bouncy",
          "Overshoot",
          "Rubber (elastic)",
          "Bounce",
          "Expo in-out",
          "Stepped"
        ]
      },
      "amount": {
        "label": "Strength"
      },
      "fill": {
        "label": "Fill",
        "options": [
          "Solid color",
          "Gradient",
          "Palette"
        ]
      },
      "color1": {
        "label": "Color 1"
      },
      "color2": {
        "label": "Color 2"
      },
      "angle": {
        "label": "Transition angle °"
      },
      "shimmer": {
        "label": "Light effect",
        "options": [
          "None",
          "Bright band",
          "Readout"
        ]
      },
      "shimspeed": {
        "label": "Light effect tempo"
      },
      "boil": {
        "label": "Boil (hand-drawn jitter)"
      },
      "boilfps": {
        "label": "Boil rate (frames/s)"
      },
      "stretch": {
        "label": "Motion stretch"
      },
      "pulse": {
        "label": "Pulse (connect a beat signal)"
      }
    }
  },
  "reveal": {
    "name": "Transition",
    "description": "A timed transition over the whole image below: crossfade, blurred zoom, fluid reveal, circle mask, flash, glitch or stripes. Apply on entrance, exit or both.",
    "params": {
      "mode": {
        "label": "Transition",
        "options": [
          "Crossfade",
          "Blurred zoom",
          "Fluid reveal",
          "Circle mask",
          "Flash",
          "Glitch cut",
          "Stripes",
          "Shape morph (circle → box → image)",
          "Fly-through (zoom-through)",
          "Spring push",
          "Diagonal wipe",
          "Opening panels"
        ]
      },
      "dir": {
        "label": "Direction",
        "options": [
          "In",
          "Out",
          "In and out"
        ]
      },
      "at": {
        "label": "Start (s)"
      },
      "dur": {
        "label": "Duration (s)"
      },
      "outAt": {
        "label": "Exit (s)"
      },
      "ease": {
        "label": "Curve",
        "options": [
          "Soft",
          "Strong",
          "Spring (legacy)",
          "Out-in",
          "Linear",
          "Spring · subtle",
          "Spring · bouncy",
          "Overshoot",
          "Rubber (elastic)",
          "Bounce",
          "Expo in-out",
          "Stepped"
        ]
      },
      "soft": {
        "label": "Softness"
      }
    }
  },
  "bento": {
    "name": "Bento grid",
    "description": "Rounded boxes in preset grids that spring open, slide, pop and rearrange into a second layout. It can mask a layer above so text enters inside the boxes.",
    "params": {
      "layout": {
        "label": "Layout",
        "options": [
          "2 × 2",
          "Hero + 2",
          "Hero + 3",
          "3 columns",
          "Sidebar + 2",
          "Mosaic (5)",
          "Mosaic (7)",
          "Card row (4)",
          "One box",
          "Bar + label",
          "3 × 3"
        ]
      },
      "anim": {
        "label": "Entrance",
        "options": [
          "Opening",
          "Pop up",
          "Slide in from below",
          "Slide in from left",
          "Reveal from left",
          "Reveal from below",
          "Crossfade",
          "None"
        ]
      },
      "order": {
        "label": "Order",
        "options": [
          "In order",
          "From center",
          "Random",
          "Together",
          "By size"
        ]
      },
      "start": {
        "label": "Start (s)"
      },
      "dur": {
        "label": "Duration (s)"
      },
      "stagger": {
        "label": "Delay per box"
      },
      "ease": {
        "label": "Curve",
        "options": [
          "Soft",
          "Strong",
          "Spring (legacy)",
          "Out-in",
          "Linear",
          "Spring · subtle",
          "Spring · bouncy",
          "Overshoot",
          "Rubber (elastic)",
          "Bounce",
          "Expo in-out",
          "Stepped"
        ]
      },
      "layout2": {
        "label": "Rearrange to",
        "options": [
          "None",
          "2 × 2",
          "Hero + 2",
          "Hero + 3",
          "3 columns",
          "Sidebar + 2",
          "Mosaic (5)",
          "Mosaic (7)",
          "Card row (4)",
          "One box",
          "Bar + label",
          "3 × 3"
        ]
      },
      "morphAt": {
        "label": "Rearrangement time (s)"
      },
      "morphDur": {
        "label": "Rearrangement duration (s)"
      },
      "outAt": {
        "label": "Close time (s, 0 = none)"
      },
      "fill": {
        "label": "Fill",
        "options": [
          "Color",
          "Glass",
          "Palette",
          "Outline only"
        ]
      },
      "color": {
        "label": "Color"
      },
      "color2": {
        "label": "Highlight color"
      },
      "accent": {
        "label": "Featured box (0 = none)"
      },
      "bw": {
        "label": "Width"
      },
      "bh": {
        "label": "Height"
      },
      "gap": {
        "label": "Gap"
      },
      "round": {
        "label": "Roundness"
      },
      "outline": {
        "label": "Outline"
      },
      "shadow": {
        "label": "Shadow"
      },
      "glass": {
        "label": "Glass blur"
      },
      "sheen": {
        "label": "Light edge"
      }
    }
  },
  "projector": {
    "name": "Projector",
    "description": "Analog projection over the image below, with dust, scratches, light leaks, exposure flicker, frame jitter, camera drift, color fringing and grain. Frame rate controls the choppy film cadence.",
    "params": {
      "dust": {
        "label": "Dust and scratches"
      },
      "leak": {
        "label": "Light leak"
      },
      "flicker": {
        "label": "Vibration"
      },
      "weave": {
        "label": "Frame jitter"
      },
      "shake": {
        "label": "Camera drift"
      },
      "tone": {
        "label": "Tone",
        "options": [
          "Original",
          "Sepia",
          "Black and white",
          "Faded color"
        ]
      },
      "chroma": {
        "label": "Colored edge"
      },
      "grain": {
        "label": "Grain"
      },
      "vig": {
        "label": "Vignette"
      },
      "fps": {
        "label": "Frame rate (frames/s)"
      }
    }
  },
  "pdisp": {
    "name": "Particle disintegration",
    "description": "An Appearance that breaks text, shapes or images into points and reassembles them. Trigger by cue, repeat or manual control. Text can change to a new word as it reforms while staying editable.",
    "params": {
      "trig": {
        "label": "Disintegration",
        "options": [
          "Manual (slider)",
          "On cues",
          "Repeated"
        ]
      },
      "spread": {
        "label": "Spread"
      },
      "out": {
        "label": "Disintegration time (s)"
      },
      "hold": {
        "label": "Scattered duration (s)"
      },
      "back": {
        "label": "Reassembly time (s)"
      },
      "every": {
        "label": "Repeat interval (s)"
      },
      "amount": {
        "label": "Disintegration (manual)"
      },
      "turb": {
        "label": "Vortex on scatter"
      },
      "density": {
        "label": "Density",
        "options": [
          "65k",
          "147k",
          "262k"
        ]
      },
      "size": {
        "label": "Point size"
      },
      "depth": {
        "label": "Depth from brightness"
      },
      "swirl": {
        "label": "Flow at rest"
      },
      "wave": {
        "label": "Wave"
      },
      "jitter": {
        "label": "Shake"
      },
      "speed": {
        "label": "Tempo"
      },
      "color": {
        "label": "Color",
        "options": [
          "Original",
          "Palette"
        ]
      },
      "bright": {
        "label": "Brightness"
      },
      "pblend": {
        "label": "Point blending",
        "options": [
          "Light (additive)",
          "Normal"
        ]
      }
    }
  },
  "particles": {
    "name": "Particles",
    "description": "Turns any image or the layers below into 65,000–262,000 particles. Brightness can create depth; audio cues can drive scattering, flow and waves.",
    "params": {
      "source": {
        "label": "Source",
        "options": [
          "Image below",
          "Your image"
        ]
      },
      "density": {
        "label": "Density",
        "options": [
          "65k",
          "147k",
          "262k"
        ]
      },
      "size": {
        "label": "Point size"
      },
      "thresh": {
        "label": "Threshold (skip dark pixels)"
      },
      "depth": {
        "label": "Depth from brightness"
      },
      "explode": {
        "label": "Scatter"
      },
      "swirl": {
        "label": "Flow"
      },
      "wave": {
        "label": "Wave"
      },
      "jitter": {
        "label": "Shake"
      },
      "tilt": {
        "label": "Tilt °"
      },
      "turn": {
        "label": "Rotation °"
      },
      "spin": {
        "label": "Rotation"
      },
      "speed": {
        "label": "Tempo"
      },
      "color": {
        "label": "Color",
        "options": [
          "Original",
          "Palette"
        ]
      },
      "bright": {
        "label": "Brightness"
      },
      "hidesrc": {
        "label": "Hide source",
        "options": [
          "No",
          "Yes"
        ]
      },
      "pblend": {
        "label": "Point blending",
        "options": [
          "Light (additive)",
          "Normal"
        ]
      }
    }
  },
  "emitter": {
    "name": "Particle Source",
    "description": "Emit particles from a point, line, ring, area or the shape of the image below. Gravity, wind, vortices and a bouncing floor shape the motion. Move the layer to draw a trail. Emission can be continuous, burst or cue-driven; seeking and export reproduce the same result.",
    "params": {
      "shape": {
        "label": "Shape",
        "options": [
          "Point",
          "Line",
          "Ring",
          "Disc",
          "Rectangle",
          "Shape of image below",
          "Path"
        ]
      },
      "rate": {
        "label": "Rate (items/s)"
      },
      "life": {
        "label": "Lifetime (s)"
      },
      "dir": {
        "label": "Direction °"
      },
      "spread": {
        "label": "Spread °"
      },
      "speed": {
        "label": "Speed"
      },
      "grav": {
        "label": "Gravity"
      },
      "look": {
        "label": "Look",
        "options": [
          "Soft dot",
          "Sharp circle",
          "Spark",
          "Streak",
          "Confetti",
          "Leaf",
          "Smoke puff"
        ]
      },
      "size": {
        "label": "Size"
      },
      "color": {
        "label": "Color",
        "options": [
          "Palette (random)",
          "Palette (age)",
          "Custom color",
          "Source image color"
        ]
      },
      "mode": {
        "label": "Timing",
        "options": [
          "Continuous",
          "Bursts",
          "On cues (J)"
        ]
      },
      "burst": {
        "label": "Particles per burst"
      },
      "every": {
        "label": "Burst interval (s)"
      },
      "ew": {
        "label": "Emitter width"
      },
      "eh": {
        "label": "Emitter height"
      },
      "radial": {
        "label": "Outward from shape"
      },
      "lifevar": {
        "label": "Lifetime variation"
      },
      "speedvar": {
        "label": "Speed variation"
      },
      "warm": {
        "label": "Prewarm",
        "options": [
          "Yes",
          "No (starts at 0)"
        ]
      },
      "seed": {
        "label": "Core"
      },
      "wind": {
        "label": "Wind →"
      },
      "gust": {
        "label": "Gusts"
      },
      "turb": {
        "label": "Vortex"
      },
      "tscale": {
        "label": "Vortex size"
      },
      "drag": {
        "label": "Drag"
      },
      "floor": {
        "label": "Floor",
        "options": [
          "None",
          "Bouncing"
        ]
      },
      "fy": {
        "label": "Floor height"
      },
      "bounce": {
        "label": "Elasticity"
      },
      "sizeEnd": {
        "label": "End size (×)"
      },
      "sizevar": {
        "label": "Size variation"
      },
      "spin": {
        "label": "Spin"
      },
      "fade": {
        "label": "Fade out"
      },
      "c1": {
        "label": "Custom color"
      },
      "bright": {
        "label": "Brightness"
      },
      "pblend": {
        "label": "Blend",
        "options": [
          "Light (additive)",
          "Normal"
        ]
      }
    }
  },
  "sdfscene": {
    "name": "3D scene",
    "description": "Edit up to eight 3D primitives—sphere, box, torus, cylinder, capsule or octahedron—and add, subtract, intersect or smoothly blend them like clay.",
    "params": {
      "material": {
        "label": "Material",
        "options": [
          "Palette",
          "Clay",
          "Chrome",
          "Iridescent",
          "Normal colors"
        ]
      },
      "env": {
        "label": "Environment",
        "options": [
          "Studio",
          "Sunset",
          "Cosmic",
          "Neon"
        ]
      },
      "rough": {
        "label": "Roughness"
      },
      "metal": {
        "label": "Metalness"
      },
      "floor": {
        "label": "Ground shadow"
      },
      "reflM": {
        "label": "Reflection",
        "options": [
          "Environment",
          "Real (scene)"
        ]
      },
      "floorM": {
        "label": "Floor",
        "options": [
          "Shadow",
          "Mirror"
        ]
      },
      "mirror": {
        "label": "Floor mirror strength"
      },
      "glow": {
        "label": "Rim lighting"
      },
      "aa": {
        "label": "Antialiasing",
        "options": [
          "Fast",
          "4× (slower)"
        ]
      },
      "spin": {
        "label": "Rotation"
      },
      "rx": {
        "label": "Tilt °"
      },
      "ry": {
        "label": "Rotation °"
      },
      "sceneL": {
        "label": "Affected by scene lighting",
        "options": [
          "No",
          "Yes"
        ]
      }
    }
  },
  "cloud3d": {
    "name": "Cloud",
    "description": "A standalone, softly lit cloud that can move, scale and orbit. Adjust shape, density, softness, detail, billowing and visual wind. Scene lighting affects it. Apply Balloon to turn it into an inflated glossy body.",
    "params": {
      "shape": {
        "label": "Shape",
        "options": [
          "Billowing",
          "Flat",
          "Towering"
        ]
      },
      "dens": {
        "label": "Density"
      },
      "soft": {
        "label": "Softness"
      },
      "detail": {
        "label": "Detail"
      },
      "billow": {
        "label": "Billowing",
        "options": [
          "Out (still)",
          "In"
        ]
      },
      "bspeed": {
        "label": "Billowing tempo"
      },
      "wind": {
        "label": "Wind (visual)"
      },
      "seed": {
        "label": "Variant"
      },
      "color": {
        "label": "Color (lit side)"
      },
      "shade": {
        "label": "Shadow color"
      },
      "glow": {
        "label": "Silver rim"
      },
      "rx": {
        "label": "Tilt °"
      },
      "ry": {
        "label": "Rotation °"
      },
      "sceneL": {
        "label": "Affected by scene lighting",
        "options": [
          "No",
          "Yes"
        ]
      }
    }
  },
  "balloon": {
    "name": "Balloon",
    "description": "An Appearance for a Cloud. Inflation turns its shape into a glossy rubber body that responds to scene lighting. Turn off billowing for a still balloon.",
    "params": {
      "infl": {
        "label": "Inflation"
      },
      "color": {
        "label": "Color"
      },
      "gloss": {
        "label": "Brightness"
      },
      "shine": {
        "label": "Glint strength"
      }
    }
  },
  "liquidglass": {
    "name": "Liquid Glass",
    "description": "The image is seen through a movable refractive glass lens. Drag onto a layer and position the lens with that layer.",
    "params": {
      "size": {
        "label": "Size"
      },
      "blur": {
        "label": "Blur"
      },
      "quality": {
        "label": "Quality",
        "options": [
          "Fast",
          "Original"
        ]
      }
    }
  },
  "windflame": {
    "name": "Windblown flame",
    "description": "A texture-based flame that changes over time. Width, speed and light can be adjusted separately.",
    "params": {
      "speed": {
        "label": "Speed"
      },
      "width": {
        "label": "Width"
      },
      "glow": {
        "label": "Light"
      }
    }
  },
  "textwrap": {
    "name": "Text on object",
    "description": "Live editable text wrapped around a rotating sphere or cylinder. Letters on the far side remain faintly visible. Edit the text in the top text bar or Content tab.",
    "params": {
      "shape": {
        "label": "Body",
        "options": [
          "Sphere",
          "Cylinder",
          "Ribbon ring"
        ]
      },
      "rep": {
        "label": "Repeat around"
      },
      "size": {
        "label": "Font size"
      },
      "spin": {
        "label": "Rotation (°/s)"
      },
      "tilt": {
        "label": "Tilt °"
      },
      "c1": {
        "label": "Text color"
      },
      "body": {
        "label": "Body",
        "options": [
          "Transparent (letters only)",
          "Solid"
        ]
      },
      "bodyc": {
        "label": "Body color"
      },
      "radius": {
        "label": "Radius"
      },
      "height": {
        "label": "Height (cylinder)"
      },
      "vpos": {
        "label": "Text position (up/down)"
      },
      "back": {
        "label": "Far side visibility"
      },
      "gloss": {
        "label": "Glint"
      },
      "ry": {
        "label": "Starting rotation °"
      },
      "persp": {
        "label": "Perspective"
      }
    }
  },
  "textextrude": {
    "name": "Extruded 3D text",
    "description": "Live editable text with real depth. Rotate it and set separate front and side colors under scene lighting.",
    "params": {
      "depth": {
        "label": "Depth"
      },
      "ry": {
        "label": "Rotation °"
      },
      "rx": {
        "label": "Tilt °"
      },
      "spin": {
        "label": "Wobble (°)"
      },
      "c1": {
        "label": "Front color"
      },
      "c2": {
        "label": "Side color"
      },
      "light": {
        "label": "Light direction °"
      },
      "gloss": {
        "label": "Glint"
      },
      "persp": {
        "label": "Perspective"
      },
      "size": {
        "label": "Size"
      }
    }
  },
  "textpath": {
    "name": "Text on path",
    "description": "Live editable text along a Path layer. Offset moves the letters along it; an internal arc is used when no path is selected.",
    "params": {
      "size": {
        "label": "Font size"
      },
      "offset": {
        "label": "Offset along path"
      },
      "speed": {
        "label": "Travel (path/s)"
      },
      "spacing": {
        "label": "Letter spacing"
      },
      "c1": {
        "label": "Text color"
      },
      "loop": {
        "label": "At end",
        "options": [
          "Run out",
          "Seamless loop"
        ]
      },
      "upright": {
        "label": "Letter orientation",
        "options": [
          "Rotate with path",
          "Upright"
        ]
      },
      "lift": {
        "label": "Distance from path"
      }
    }
  },
  "fluid": {
    "name": "Flowing ink",
    "description": "A fluid simulation where moving sources release colored ink that swirls and fades. Drag the layer during playback to inject flow. Seeking and export reproduce the same frame.",
    "params": {
      "count": {
        "label": "Source count"
      },
      "spread": {
        "label": "Spread"
      },
      "force": {
        "label": "Force"
      },
      "size": {
        "label": "Patch size"
      },
      "curl": {
        "label": "Swirl"
      },
      "fade": {
        "label": "Decay"
      },
      "tempo": {
        "label": "Tempo"
      },
      "wind": {
        "label": "Wind"
      },
      "dir": {
        "label": "Wind direction °"
      },
      "pulse": {
        "label": "Pulse"
      },
      "seed": {
        "label": "Seed"
      },
      "qual": {
        "label": "Quality",
        "options": [
          "Fast",
          "Normal",
          "Subtle"
        ]
      },
      "bright": {
        "label": "Brightness"
      }
    }
  },
  "fluidfx": {
    "name": "Fluid distortion",
    "description": "Fluid flows through this layer and displaces its image. In Reveal mode, only areas reached by ink are visible.",
    "params": {
      "amount": {
        "label": "Distortion"
      },
      "mode": {
        "label": "Mode",
        "options": [
          "Distortion",
          "Reveal"
        ]
      },
      "edge": {
        "label": "Rim light"
      },
      "count": {
        "label": "Source count"
      },
      "spread": {
        "label": "Spread"
      },
      "force": {
        "label": "Force"
      },
      "size": {
        "label": "Patch size"
      },
      "curl": {
        "label": "Swirl"
      },
      "fade": {
        "label": "Decay"
      },
      "tempo": {
        "label": "Tempo"
      },
      "wind": {
        "label": "Wind"
      },
      "dir": {
        "label": "Wind direction °"
      },
      "pulse": {
        "label": "Pulse"
      },
      "seed": {
        "label": "Seed"
      },
      "qual": {
        "label": "Quality",
        "options": [
          "Fast",
          "Normal",
          "Subtle"
        ]
      }
    }
  },
  "unwoven": {
    "name": "Woven gallery",
    "description": "A row of image cards that breaks into threads at the canvas edge. Time can be rewound, and the images can be replaced.",
    "params": {
      "speed": {
        "label": "Drift (units/s)"
      },
      "strength": {
        "label": "Disintegration"
      },
      "zone": {
        "label": "Disintegration band"
      },
      "wobble": {
        "label": "Float"
      },
      "cardh": {
        "label": "Card height"
      },
      "cardw": {
        "label": "Card width (× height)"
      },
      "gap": {
        "label": "Spacing"
      },
      "radius": {
        "label": "Corner"
      },
      "threads": {
        "label": "Threads"
      },
      "seed": {
        "label": "Random"
      },
      "offset": {
        "label": "Offset"
      }
    }
  }
};
export const effectName = (type: string, fallback = type) => EFFECT_EN[type]?.name || fallback;
export const effectDescription = (type: string, fallback = "") => EFFECT_EN[type]?.description || fallback;
export function effectParam(type: string, param: any): any {
  const c = EFFECT_EN[type]?.params[param.k];
  return c ? { ...param, l: c.label, ...(c.options ? { opts: c.options } : {}) } : param;
}

/** Display-only group headings; the original group title remains the saved open-state key. */
export const GROUP_EN: Record<string,string> = {
  'Fő beállítások':'Main controls','Forma':'Shape','Anyag':'Material','Fény':'Light',
  'Padló és háttér':'Floor and background','Kamera':'Camera','Kép':'Image',
  'Kirajzolás és szaggatás':'Drawing and dashes','Élő vonal és fény':'Living line and light',
  'Keret (kivágás)':'Frame (crop)','Követés':'Tracking','Jelölők':'Markers',
  'Összekötés':'Connections','Feliratok':'Labels','Hatás a dobozokon belül':'Effect inside boxes',
  'Kibocsátás':'Emission','Erők':'Forces','Kinézet':'Look','Szín és fény':'Color and light',
  'Nézet':'View','Test':'Body','Fény és nézet':'Light and view'
};
