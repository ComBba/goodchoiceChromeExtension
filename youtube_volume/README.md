# YouTube Volume Scheduler

YouTube Volume Scheduler is a Chrome extension that automatically adjusts the volume of YouTube videos based on the time of day. This can be useful for managing volume levels during different parts of the day, such as lowering the volume at night or increasing it during the day.

## Features

- Automatically adjusts YouTube video volume based on the hour of the day.
- Simple interface to set volume levels for each hour.
- Runs in the background and adjusts volume every hour.

## Installation

1. **Clone or download this repository** to your local machine.
2. **Open Chrome** and navigate to `chrome://extensions/`.
3. **Enable "Developer mode"** in the top right corner.
4. **Click "Load unpacked"** and select the directory where you downloaded/cloned the repository.

## Usage

1. **Click on the extension icon** in the Chrome toolbar.
2. **Set the desired volume levels** for each hour using the provided interface.
3. **Click "Save Schedule"** to save your settings.
4. The extension will now automatically adjust the volume of YouTube videos based on your schedule.

## Files

- `manifest.json`: Describes the extension and its permissions.
- `background.js`: Manages the scheduling and background tasks.
- `content.js`: Runs on YouTube pages to adjust the volume.
- `popup.html`: Provides the user interface for setting the volume schedule.
- `popup.js`: Handles the UI interactions for setting the volume schedule.
- `icons/`: Contains the icons for the extension.

## Contributing

1. **Fork the repository**.
2. **Create a new branch** (`git checkout -b feature-branch`).
3. **Make your changes**.
4. **Commit your changes** (`git commit -am 'Add new feature'`).
5. **Push to the branch** (`git push origin feature-branch`).
6. **Create a new Pull Request**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgementss

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [YouTube API Documentation](https://developers.google.com/youtube/)

## Contact

For any questions or suggestions, please open an issue or contact the repository owner.
