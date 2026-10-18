# Mask and material editor references

*(ChatGPT kutatása, a felhasználó mentette; a feladat: UI-UPDATE.md 1., 2., 5. pont.)*

## Figma

Figma lets almost any layer act as a mask, including vector shapes, text, images with transparency, or groups. A mask layer reveals or hides following layers in the layer stack, making the relationship visible and easy to rearrange. Blend modes can be applied to layers, fills, and effects, with a live canvas preview. A clear Vel pattern is a visible mask thumbnail with an adjacent invert toggle, plus a separate blend-mode menu and opacity control. Keep the preview immediate and make the mask source easy to replace.

## After Effects

After Effects distinguishes a path mask on a layer from a track matte that uses another layer or one of its channels to define transparency. Mask modes combine multiple masks on one layer, while track-matte controls show the matte source and alpha/luma behavior. Layer blending modes are available alongside track-matte controls, and changes can be animated. For Vel, borrow the explicit source/mode pairing and separate “shape mask” from “use another layer as matte.” A compact preview of the matte source would make the relationship easier to understand.

## Photoshop

Photoshop's layer mask is a grayscale, non-destructive visibility map: white reveals, black hides, and gray partially reveals. Users can paint directly on the mask, invert it, or derive it from a selection. Layer opacity and blend mode sit in the Layers panel, while clipping masks constrain one layer to the visible content of another. The easiest Vel pattern is a selectable mask source plus a thumbnail that opens direct editing, with invert and feather controls nearby. Keep blend mode and opacity in a distinct, always-visible material section.

## Procreate

Procreate exposes layer options from the Layers panel and offers Alpha Lock, Clipping Mask, and Layer Mask for different kinds of visibility control. A clipping mask uses the content of the layer below as its boundary; a layer mask provides editable conceal/reveal behavior. Blend modes are chosen per layer in the same layer-focused workflow. For Vel, use plain-language choices (“Clip to layer below” and “Add editable mask”) and show a small state badge on the layer. Keep blend mode and opacity reachable without opening a deep settings dialog.

## Blender Shader Editor

Blender builds material behavior as a node graph. A mask can be created from a texture, color, or procedural node and connected to a Mix node's factor; the factor controls how the two inputs combine. The Mix node also offers blend operations, with the factor acting as the mask/strength input. For Vel, borrow the simple two-input mental model: source A, source B, a named blend operation, and one visible mask/strength slider. Offer an advanced graph only when needed, while the common path remains a small, readable set of connected controls.

## Sources

- [Figma masks](https://help.figma.com/hc/en-us/articles/360040450253-Masks)
- [Figma blend modes](https://help.figma.com/hc/en-us/articles/360040667874-Apply-blend-modes-to-layers-fills-and-effects)
- [After Effects alpha channels, masks and mattes](https://helpx.adobe.com/after-effects/desktop/work-with-transparency-and-compositing/work-with-alpha-channels-and-masks/alpha-channels-masks-mattes.html)
- [After Effects track mattes](https://helpx.adobe.com/after-effects/desktop/work-with-transparency-and-compositing/work-with-track-mattes-and-traveling-mattes/track-mattes-and-traveling-mattes.html)
- [Photoshop layer masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html)
- [Photoshop opacity and blend modes](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/apply-layer-effects/set-layer-opacity-and-blending-modes.html)
- [Procreate layers](https://help.procreate.com/procreate/handbook/layers)
- [Procreate blend modes](https://help.procreate.com/procreate/handbook/5.4/layers/layers-blend)
- [Blender Mix node](https://docs.blender.org/manual/en/latest/editors/texture_node/types/color/mix_rgb.html)
