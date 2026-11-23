# adinaviv.com

Personal website for Adin Aviv: a static site (HTML, CSS and JS, no build step).

## Structure

```
index.html          All page content (sections: about, experience, projects, skills, certificates, contact)
css/style.css       Styles, including light/dark themes
js/main.js          Mobile nav, theme toggle, scroll effects, image lightbox, hero waveform
assets/img/         Photos, project images, certificate logos
assets/video/       Project demo GIFs (muted)
assets/docs/        Resume, reports and research poster (PDF)
```

## Preview locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Common edits

- **Add a demo clip:** the demos are muted GIFs in `assets/video/`. Make one with ffmpeg
  (`-an` drops the audio, then scale and palette it) and point an `<img class="demo-gif">` at it.
- **Update the resume:** replace `assets/docs/Adin_Aviv_Resume.pdf` (keep the same file name).
- **Add a project:** copy an existing `<article class="project">` block in `index.html`.
