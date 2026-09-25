# Play and stories update — 24 September 2026

## Included

- Explore discovery club: four illustrated entry cards, five-room tour with visited-room stamps and contextual questions, existing equipment and games retained.
- Healthcare guide: independent model instances on clinician changes; greeting replay; local Pause actually pauses the model. Female GLB decoding, skeletal greeting and blink/reopening checked with the Three.js runtime. The models remain editable in Blender.
- Quiet Moments: optional animated flower with three petal colours, six collectible shells with a changing imaginary cloud, and a six-flower garden with four sensory/imagination prompts. Reset controls, keyboard buttons, no autoplay audio, reduced-motion handling. No account required; play choices stay in component memory.
- Four complete original bilingual stories, each four pages with two optional choices per page and matching responses: Wanees and the pocket of courage; Maryam and the listening shell; Amer’s very good question; The lantern of little kindnesses. Search, page navigation, restarting, endings and a story shelf are included. Existing parent resources and printables remain below the shelf.

## Research and rights

Research consulted on 24 September 2026:

- [Pratham Books’ StoryWeaver open-content explanation](https://storyweaver.org.in/en/open-content): useful source of openly licensed multilingual children’s books. Linked for grown-ups inside the library. No StoryWeaver story text or illustrations were copied into this delivery; individual stories would require full author, illustrator, translator and funder attribution when reused.
- [Great Ormond Street Hospital: About the Play team](https://www.gosh.nhs.uk/patients-and-families/support-services/play-team/about-play-department/): context for using play, creativity and books to help children understand healthcare experiences. Linked for grown-ups. No endorsement or affiliation is implied.

The four in-app Wanees stories and vector scenery were authored for this project; character pictures use the existing original Blender renders. They are fictional comfort/creative-play content, not clinical instructions or approved descriptions of an actual hospital visit. No third-party image APIs, tracking, remote fonts or additional dependencies were introduced.

## Verification

TypeScript, ESLint and production build pass. Eight frontend tests pass, including complete story navigation/restart, Arabic story responses, shell collection/reset and preservation of global motion settings. The female GLB passes actual Three.js decoding and greeting/blink checks. Browser checks cover the guide, Explore, stories and Quiet Moments; see the delivery conversation for the final outcome.
