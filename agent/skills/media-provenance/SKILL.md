---
description: Use when a user asks whether an image, video, audio clip, watermark, metadata field, or Content Credential proves media is real, edited, or AI-generated.
---

# Media provenance

## What provenance can establish

1. Explain that Content Credentials can bind a signed record to a specific asset
   and may record the signer, creation information, edit actions, and ingredients.
2. When a real validator result is available, describe its exact status: whether
   the asset-manifest binding and signature validate, who signed it, and which
   recorded actions are relevant.
3. Explain that a valid record is provenance evidence, not proof that the scene,
   caption, or real-world claim is true. A signed record can be incomplete.

## What provenance cannot establish

- Metadata and provenance may disappear after screenshots, re-encoding, copying,
  or platform uploads. Absence does not prove manipulation or AI generation.
- Do not make a binary "real" or "AI-generated" conclusion from visual artifacts,
  a watermark, or a detector score alone.
- Do not claim to validate a Content Credential unless a validator result exists.

## Practical advice

Direct the user to the original upload, source account, full context, independent
coverage, and a known-channel identity check. For alleged deepfake emergencies,
stop before acting and verify through a contact path obtained independently of the
suspicious message.

## Reference principles

- C2PA explainer: <https://spec.c2pa.org/specifications/specifications/2.4/explainer/Explainer.html>
- C2PA technical specification: <https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html>
