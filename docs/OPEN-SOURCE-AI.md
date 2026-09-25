# Character chat and voice choices

The implementation uses open-source services hosted by the Wanees operator. The frontend sends authenticated requests to the ASP.NET API; only that API reaches the private model services. No OpenAI, paid speech API, proprietary chat gateway or cloud authentication dependency is used.

## Components and primary sources

| Purpose | Component | License / upstream |
|---|---|---|
| Conversation | Qwen3-4B for hosting; Qwen3-0.6B for local CPU preview, served by Ollama | Qwen weights: Apache-2.0, [4B model card](https://huggingface.co/Qwen/Qwen3-4B), [0.6B model card](https://huggingface.co/Qwen/Qwen3-0.6B). Ollama: MIT, [source](https://github.com/ollama/ollama). |
| English speech | Kokoro-82M, `kokoro==0.9.4` | Apache-2.0, [model card](https://huggingface.co/hexgrad/Kokoro-82M), [voice catalog](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md), [engine](https://github.com/hexgrad/kokoro). |
| Arabic speech | Chatterbox Multilingual, `chatterbox-tts==0.1.7` | MIT, [source](https://github.com/resemble-ai/chatterbox), [model family](https://huggingface.co/ResembleAI/chatterbox), [publisher’s multilingual description](https://www.resemble.ai/learn/models/chatterbox-multilingual). |
| Private speech HTTP worker | FastAPI + Uvicorn | MIT / BSD-3-Clause. No public endpoint in Compose. |
| English pronunciation fallback | eSpeak NG | GPL-3.0-or-later; [source and license](https://github.com/espeak-ng/espeak-ng). It is a dependency, not the character’s final spoken voice. |

Reviewed against primary sources on 23 September 2026. Engine, model and voice licenses are separate considerations. Keep upstream licenses/notices when distributing their packages or weights. Images download dependencies during build and models during first use; the handoff archive does not bundle all neural model weights. Upstream licenses remain authoritative.

## Initial casting

| Character | English stock voice | Direction |
|---|---|---|
| Wanees | `bm_george`, speed 0.94 | Relaxed, measured male narrator for the gentle sheep. |
| Amer | `am_fenrir`, speed 0.97 | A lighter, curious male delivery. |
| Maryam | `af_heart`, speed 0.96 | Warm female delivery with clear phrasing. |

These are **initial audition choices**, not professionally cast Omani child actors. They are synthetic stock voices, not clones of a named actor or the child pictured in the references. Naturalness and character fit remain subjective. Kokoro does not provide Arabic in this configuration.

The reference-pack command generates three English clips from those stock voices. The optional Arabic Chatterbox worker conditions on those synthetic clips to distinguish the characters. Cross-language accent and pronunciation need listening review, especially names and Omani expressions. Do not describe this as a verified native Omani voice pack. Keep Chatterbox’s embedded watermark; this implementation does not remove it. No user-uploaded voice-cloning endpoint is exposed.

## Conversation behavior

Each conversation fixes its companion and language. The model receives a short character instruction and up to six recent exchanges. Replies are short, warm and intended for adult-supervised ages 5–10. The model is told it is an AI character, must not request personal identifiers or secrets, and must redirect clinical decisions to the trusted adult / care team. It does not receive saved caregiver records. It has no browsing, tools, booking actions or contact-with-clinicians capability.

This is a functional conversational integration, **not a guarantee that a general language model will follow every rule**. The current system prompt is not a validated moderation classifier, medical triage system or substitute for human supervision. It does not retrieve reviewed hospital knowledge; therefore it must not promise hospital-specific information. Evaluate adversarial prompts, Arabic behavior and clinical boundaries before release to real families.

History lives in PostgreSQL, is owner-scoped, and can be deleted/exported. A failed model call saves no fabricated response. Voice synthesis is on demand with no app audio cache. The web character continues its existing rig animation while a reply plays; this is not phoneme-accurate lip synchronization. Changing companion or leaving the page stops the audio.

See `../deploy/README.md` for installation and `ACCOUNT-CHAT-VERIFICATION.json` for security/integration checks. The automated fixture verifies the API contract, not model intelligence or voice quality.

## Local verification outcome (24 September)

Real Qwen3-0.6B replies passed both direct Ollama and authenticated application checks. The full app request took about 48 seconds on this Mac; CPU inference is slower than a hosted GPU service. Set `AI:Threads` appropriately; two CPU threads performed far better than the runtime’s automatic high thread count here. The three English auditions and a live English speech request passed. The Arabic Docker image ultimately built successfully, including Chatterbox import and generation-signature checks. Actual Arabic speech synthesis and listening review have not yet been completed. Treat Arabic casting/pronunciation as unverified until the optional service is tested on the deployment server.
