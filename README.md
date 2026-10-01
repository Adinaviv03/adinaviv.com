# adinaviv.com

Personal website for Adin Aviv: a static site (HTML, CSS and JS, no build step).

## Structure

```
index.html          All page content (sections: about, experience, projects, skills, certificates, contact)
css/style.css       Styles, including light/dark themes
js/main.js          Mobile nav, theme toggle, scroll effects, image lightbox, hero waveform
assets/img/         Photos, project images, certificate logos
assets/video/       Project demo videos
assets/docs/        Resume, reports and research poster (PDF)
```

## Preview locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Common edits

- **Add the AEV demo video:** save it as `assets/video/aev-demo.mp4`, then in `index.html` find the
  `VIDEO PLACEHOLDER` comment and replace the `video-placeholder` div with the `<video>` tag shown there.
- **Update the resume:** replace `assets/docs/Adin_Aviv_Resume.pdf` (keep the same file name).
- **Add a project:** copy an existing `<article class="project">` block in `index.html`.
