## Environment Security Update

- Rotated the local Django `SECRET_KEY` and stored the new value in the ignored `.env` file.
- Updated Django entry points to default to `moveon.settings.development`, with production selectable through `DJANGO_SETTINGS_MODULE`.
