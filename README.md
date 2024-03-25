# Zoho time entry

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://gitlab.com/nithinv86/zoho-time-entry">
    <img src="./favicon.png" alt="Logo" width="80" height="80">
  </a>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About </a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <!-- <li><a href="#installation">Installation</a></li> -->
        <li><a href="#commands">Commands</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About Zoho time entry

If you find yourself grappling with Zoho's time entry system, fret not! There's a straightforward and effective alternative method available to help you effortlessly track and update your time.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Simply run `npm install @mails2nithin/zoho-time-entry` the app onto your local machine, follow the initial setup instructions, and you'll be able to effortlessly track and update your time. Enjoy the convenience it brings!

### Prerequisites

To use the software, you'll need:

- npm:

Open your terminal and execute the command mentioned BELOW to install or update npm to the latest version globally.

```sh
npm install npm@latest -g
```

- Docker:

Click on the provided link to access the Docker installation guide. Follow the instructions specific to your operating system to download and install Docker. ([Read more](https://docs.docker.com/engine/install/))

- MongoDB:

Visit the MongoDB website using the provided link. ([Read more](https://www.mongodb.com/))
Sign up for an account if you don't have one already. Follow the registration process.
Once registered, you can access Notion via your web browser or download the desktop or mobile app for a more streamlined experience.
Ensure that all required software is properly installed and configured to use the software effectively.

### Commands

After creating the Docker container, you can utilize the app with the following commands:

- To check the Docker and container status, use the command:

  ```sh
  time health
  ```

- To retrieve the time entries for the last week, use the command:

  ```sh
  time status
  ```

- To retrieve time entries for a specific period, specify the start and end dates in the format `yyyy-mm-dd` using the following command:

  ```sh
  time status -f <start_date> -t <end_date>
  ```

  Ensure to replace `<start_date>` and `<end_date>` with the desired dates in the specified format. This will allow you to effectively manage and track your time entries using the app within the Docker container.

- To add a time entry, use either of the following commands:

  ```sh
  time add -p <project name> -s <sprint> -t <task id> -dt <date in 'yyyy-mm-dd' format> -w <short description> -du <duration in minutes> -r <comments>
  ```

  or

  ```sh
  time add -project <project name> -sprint <sprint number> -date <date in 'yyyy-mm-dd' format> -task <task id> -work <short description> -duration <duration in minutes> -remarks <comments>
  ```

- To update a time entry, use the following command:

  ```sh
  time update -id <id of the current entry> -p <project name> -s <sprint> -t <task id> -dt <date in 'yyyy-mm-dd' format> -w <short description> -du <duration in minutes> -r <comments>
  ```

  Ensure that the ID is mandatory and the rest of the fields are optional.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are welcomed and greatly appreciated! Here's how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/YourFeature`)
3. Commit your Changes (`git commit -m 'Add some YourFeature'`)
4. Push to the Branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

If you have any suggestions for improvements or new features, feel free to open an issue with the "enhancement" tag. Don't forget to give the project a star if you find it useful. Thank you for your contributions!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

This project is distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

If you have any questions or suggestions regarding the Zoho time entry, feel free to reach out to Nithin V:

- Email: mails2nithin@gmail.com

Project Link: [https://gitlab.com/nithinv86/zoho-time-entry](https://gitlab.com/nithinv86/zoho-time-entry)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
