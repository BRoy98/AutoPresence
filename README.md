# AutoPresence

AutoPresence is a tool to automate [keka](https://www.keka.com/) attendence, if you're too busy in traffic or hate to do manual work everyday. 

## Disclaimer

AutoPresence is developed with the intension of using this tool only for educational purpose.

## What does it do?

1. It will open keka, and login to Keka with your given credentails.
2. If it comes to captcha page, it'll automatically read the captcha text using Google Vision and extract the text to pass the captcha.
3. Next it might ask for OTP from Mail/SMS. You Need to setup a forword rule from your work email to your personal for Keka OTP emails.
4. This has a gmail app configured with will access your personal email and wait for the Keka email to arrive.
5. Once it finds a new Keka OTP on your personal email, it'll extract the OTP from the email and enter the OTP to login
6. Finally, it has a cron which does ClockIn and ClockOut on a random time. (-30 min to +30 min of the given clock in/out time) 

## Setup

1. It is written in NodeJS. So, make sure you have Node 16+ installed on your system.
2. You can spinup a server on AWS/GCP/Azure host it on any server.
3. I'll post a detailed 'HowTo' once I get some free time. Drop me mail if you you want to try it out.
