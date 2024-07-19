/* Javascript for the Pomodoro website
    Made by N.Aslan
    19/07/24 (EU) */



let timerInterval;
let remainingTime = 25 * 60; // Pomodoro time in seconds (25 minutes)
let currentTimerDuration = remainingTime; // Variable to store the current timer duration
let sessionCount = 0; // Counter for Pomodoro and break sessions
let scheduleStarted = false; // Flag to track if the Pomodoro schedule has started

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    menu.classList.toggle('open');
}

function changeBackground(backgroundClass) {
    document.body.className = backgroundClass;
}

function setDefaultBackground() {
    document.body.style.backgroundColor = '#a3b49a';
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                displayTimer();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Time's up!");
                handleSessionCompletion();
            }
        }, 1000); // Interval set to 1000ms (1 second)
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetToCurrentTime() {
    remainingTime = currentTimerDuration;
    displayTimer();
}

function resetToPomodoroTime() {
    remainingTime = 25 * 60; // Reset Pomodoro time to 25 minutes in seconds
    currentTimerDuration = remainingTime;
    displayTimer();
}

function displayTimer() {
    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;
    document.getElementById('timer').textContent =
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`; // Format as mm:ss
}

function openBackgroundModal() {
    document.getElementById('backgroundModal').style.display = 'flex';
}

function closeBackgroundModal() {
    document.getElementById('backgroundModal').style.display = 'none';
}

function uploadBackgroundImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.backgroundSize = 'cover'; // Ensure the image covers the entire background
        };
        reader.readAsDataURL(file);
    }
}

function startBreak(seconds) {
    remainingTime = seconds;
    currentTimerDuration = remainingTime;
    displayTimer();
    stopTimer(); // Stop any running timer
    startTimer();
    updateProgressIndicator();
}

function startPomodoroSchedule() {
    resetToPomodoroTime(); // Reset timer to 25 minutes
    sessionCount = 0; // Reset session count
    scheduleStarted = true; // Set schedule started flag
    updateProgressIndicator(); // Update the progress indicator initially
    startPomodoro(); // Start the first Pomodoro
    document.querySelector('.progress-indicator').style.display = 'block'; // Show the progress indicator
    
    // Remove the "Start Pomodoro Schedule" button
    const startButton = document.getElementById('startScheduleButton');
    startButton.parentNode.removeChild(startButton);
}

function startPomodoro() {
    remainingTime = 25 * 60; // Reset Pomodoro time to 25 minutes for each session
    currentTimerDuration = remainingTime;
    displayTimer();
    startTimer(); // Start the Pomodoro timer
    updateProgressIndicator();
}

function handleSessionCompletion() {
    if (sessionCount % 2 === 0) {
        // Pomodoro completed
        updateProgressIndicator('Completed');
        if (sessionCount < 7) {
            // Start break if less than 4 Pomodoros completed
            sessionCount++;
            startBreak(5 * 60); // Start a 5-minute break
        } else {
            alert("Pomodoro schedule completed!");
            updateProgressIndicator();
        }
    } else {
        // Break completed
        updateProgressIndicator('Completed');
        if (sessionCount < 7) {
            // Start next Pomodoro if less than 4 Pomodoros completed
            sessionCount++;
            startPomodoro(); // Start the next Pomodoro
        } else {
            alert("Pomodoro schedule completed!");
            updateProgressIndicator();
        }
    }
}

function updateProgressIndicator(status = 'In Progress') {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepStatus = step.querySelector('.step-status');
        if (index === sessionCount) {
            stepStatus.textContent = status;
        } else if (index < sessionCount) {
            stepStatus.textContent = 'Completed';
        } else {
            stepStatus.textContent = 'Not started';
        }
    });
}

function refreshPage() {
    window.location.reload();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Initialize timer display
displayTimer();
