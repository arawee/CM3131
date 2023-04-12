# Snoke

App designed to aid stopping smoking. It allows logging your smokes and displays this on a daily graph. It also displays tips for stopping smokg from the NHS API and allows for customisation trough settings.


# Functionality

## Main Screen
- Timer
- Button "SNOKE" that displays a tip for stopping smoking
    - Tip contains a random illustration and a text tip from the NHS API
- Button "Broke the streak..." that resets the timer

## Statistics
- Graph that displays how many times the timer has been cancelled

## Settings
- Toggles for enabling/disabling settings
    - Tip modal when clicking "SNOKE" button
    - Tip modal when clicking "Broke the streak..." button
    - Reset timer when clicking the "SNOKE" button
        - Also resets when clicking button in tip modal

----------

### Indexed Database
- Stores dates and times of "SNOKE" and "Broke the streak..."
- Stores settings

----------

### Testing
- Visual Studio Code
    - Live server extension
- Google Chrome DevTools
    - Testing on iPhone SE
    - Minimum width tested for: 320px
- LambdaTest
    - live iOS/Android testing
    

#### Technical

|      Case       |      Result     |
| --------------- | --------------- |
|     Open App    |       Pass      |
|    Log smoke    |       Pass      |
|    Log Snoke    |       Pass      |
| See statistics  |       Pass      |
| Change setting  |       Pass      |

#### UX/UI

|           Case           |      Result     |
| ------------------------ | --------------- |
|     Responsiveness <sup>1)</sup>    |       Pass      |
|     Minimise input <sup>2)</sup>    |       Pass      |
|Minimise cognitive load <sup>3)</sup>|       Pass      |
|  Non-repetetive info <sup>4)</sup>  |       Pass      |
|        Display Snoke on graph       |       Fail      |
|               Tutorial              |     On Hold     |

<sup>1) Added on-hover + transform to relevant elements (also smooth scroll on menu orientation)
2) Redesigned main screen –> simplified and enlarged elements, added functionality
3) Changed the architecture to a "finite feed" with anchors
4) Is now choosing different tip for stopping smoking and illustration in modals (popup windows).</sup>

----------

### DEMO DATA

To remove demo data:
1. Delete/comment out code for data entry in db.js (marked DEMO)
2. Delete database 
    In Chrome:
    1. Open DevTools
    2. Go to "Application"
    3. Select local indexed database called "snoke"
    4. Delete it 
3. Refresh page

### Refernces
- NHS API: https://health.gov/our-work/national-health-initiatives/health-literacy/consumer-health-content/free-web-content/apis-developers
- Illustration source (Free with trial): https://www.iconfinder.com/alekseyvanin
- ChatGPT (debugging and element pre-creation): https://chat.openai.com 

___

App created for CM3131
