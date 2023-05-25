// Create the data store object
const dataStore = {
    numFloors: 0, // Total number of floors in the building
    numLifts: 0, // Total number of lifts in the building
    liftPositions: [], // Current floor position of each lift
    liftDirections: [], // Current direction of each lift
    floorButtons: [], // Status of buttons on each floor
  
    // Initialize the data store with the given number of floors and lifts
    initialize(numFloors, numLifts) {
      this.numFloors = numFloors;
      this.numLifts = numLifts;
      this.liftPositions = Array(numLifts).fill(1); // Initialized to 1st floor
      this.liftDirections = Array(numLifts).fill(null); // No direction initially
      this.floorButtons = Array(numFloors).fill(false); // Buttons not pressed initially
    },
  
    // Update lift position for a specific lift
    updateLiftPosition(liftIndex, floor) {
      this.liftPositions[liftIndex] = floor;
    },
  
    // Update lift direction for a specific lift
    updateLiftDirection(liftIndex, direction) {
      this.liftDirections[liftIndex] = direction;
    },
  
    // Set the status of a floor button to indicate it's pressed
    pressFloorButton(floor) {
      this.floorButtons[floor - 1] = true; // Floors are 1-indexed
      console.log(`Button pressed on Floor ${floor}`);
    },
  
    // Get the current position of a specific lift
    getLiftPosition(liftIndex) {
      return this.liftPositions[liftIndex];
    },
  
    // Get the current direction of a specific lift
    getLiftDirection(liftIndex) {
      return this.liftDirections[liftIndex];
    },
  
    // Get the status of a floor button
    getFloorButtonStatus(floor) {
      return this.floorButtons[floor - 1]; // Floors are 1-indexed
    },
  };
  
  // Initialize the data store with the desired number of floors and lifts
  dataStore.initialize(5, 3);
  
  // Define the JS Engine for lift control
  const liftControlEngine = {
    allocateLift(floor, direction) {
      const liftPositions = dataStore.liftPositions;
      const liftDirections = dataStore.liftDirections;
  
      // Find the available lifts
      const availableLifts = [];
      for (let i = 0; i < liftPositions.length; i++) {
        if (liftDirections[i] === null || liftDirections[i] === direction) {
          availableLifts.push(i);
        }
      }
  
      // If there are available lifts, find the closest one
      if (availableLifts.length > 0) {
        let closestLiftIndex = availableLifts[0];
        let minDistance = Math.abs(liftPositions[closestLiftIndex] - floor);
  
        for (let i = 1; i < availableLifts.length; i++) {
          const liftIndex = availableLifts[i];
          const distance = Math.abs(liftPositions[liftIndex] - floor);
          if (distance < minDistance) {
            minDistance = distance;
            closestLiftIndex = liftIndex;
          }
        }
  
        // Update the lift position and direction in the data store
        dataStore.updateLiftPosition(closestLiftIndex, floor);
        dataStore.updateLiftDirection(closestLiftIndex, direction);
  
        // Get the current position of the allocated lift
        const currentLiftPosition = dataStore.getLiftPosition(closestLiftIndex);
  
        // Animate the lift movement from the current position to the requested floor
        animateLift(closestLiftIndex, currentLiftPosition, floor);
  
        // Return the index of the allocated lift
        return closestLiftIndex;
      }
  
      // If no available lifts, return -1
      return -1;
    },
  };
  
  // Function to create the floors dynamically based on the number of floors in the data store
  function createFloors() {
    const floorsContainer = document.getElementById('floors');
    floorsContainer.innerHTML = '';
  
    const numFloors = dataStore.numFloors;
  
    for (let i = numFloors; i > 0; i--) {
      const floorElement = document.createElement('div');
      floorElement.classList.add('floor');
  
      const floorNumberElement = document.createElement('span');
      floorNumberElement.classList.add('floor-number');
      floorNumberElement.textContent = `Floor ${i}`;
  
      const floorButtonsElement = document.createElement('div');
      floorButtonsElement.classList.add('floor-buttons');
  
      const upButtonElement = document.createElement('button');
      upButtonElement.textContent = '▲';
      upButtonElement.addEventListener('click', () => {
        requestLift(i, 'up');
        console.log(`Requested lift to Floor ${i} going up`);
      });
  
      const downButtonElement = document.createElement('button');
      downButtonElement.textContent = '▼';
      downButtonElement.addEventListener('click', () => {
        requestLift(i, 'down');
        console.log(`Requested lift to Floor ${i} going down`);
      });
  
      floorButtonsElement.appendChild(upButtonElement);
      floorButtonsElement.appendChild(downButtonElement);
  
      floorElement.appendChild(floorNumberElement);
      floorElement.appendChild(floorButtonsElement);
  
      floorsContainer.appendChild(floorElement);
    }
  }
  
  // Rest of the code remains unchanged
  
  function createLifts() {
    const numLifts = dataStore.numLifts;
    const liftsContainer = document.getElementById('lifts-section');
    liftsContainer.innerHTML = '';
    const liftWidth = 80; // Width of each lift including margins
    const containerWidth = liftsContainer.offsetWidth;
    const totalWidth = liftWidth * numLifts;
    const spacing = (containerWidth - totalWidth) / (numLifts + 1); // Calculate the spacing between lifts
  
    for (let i = 0; i < numLifts; i++) {
      const liftElement = document.createElement('div');
      liftElement.classList.add('lift');
      liftElement.id = `lift-${i}`;
      liftElement.style.bottom = `$calc((var(--current-floor) - 1) * 70px)`;

      liftElement.style.bottom = `${i * 70}px`; // Adjust the position of each lift
      liftElement.style.left = `${spacing + i * liftWidth}px`; // Set the left position of each lift

      const liftDoorElement = document.createElement('div');
      liftDoorElement.classList.add('door');
      liftElement.appendChild(liftDoorElement);
  
      liftsContainer.appendChild(liftElement);
    }
  }
  
  
  
  
  // Rest of the code remains unchanged
  
  
  
  // Function to update the UI with the latest lift positions and directions
  // Function to update the UI with the latest lift positions and directions
function updateUI() {
    const liftPositions = dataStore.liftPositions;
    const liftDirections = dataStore.liftDirections;
  
    const floorsContainer = document.getElementById('floors');
    const floorElements = floorsContainer.getElementsByClassName('floor');
  
    for (let i = 0; i < liftPositions.length; i++) {
      const liftPosition = liftPositions[i];
      const liftDirection = liftDirections[i];
      const floorIndex = dataStore.numFloors - liftPosition;
  
      const floorElement = floorElements[floorIndex];
  
    //   Remove existing lift element
      const existingLiftElement = document.getElementById(`lift-${i}`);
      if (existingLiftElement) {
        existingLiftElement.remove();
      }
  
    //   Create new lift element
      const liftElement = document.createElement('div');
      liftElement.classList.add('lift');
      liftElement.id = `lift-${i}`;
      liftElement.style.bottom = `${floorIndex * 20}px`; // Adjust the position based on floor height
      liftElement.style.left = `${50}px`; // Adjust the position based on floor height


      floorsContainer.appendChild(liftElement);
  
      // Update lift direction class
      floorElement.classList.remove('lift-up', 'lift-down');
      if (liftDirection === 'up') {
        floorElement.classList.add('lift-up');
      } else if (liftDirection === 'down') {
        floorElement.classList.add('lift-down');
      }
  
      // Update floor buttons
      const upButtonElement = floorElement.querySelector('.up-button');
      const downButtonElement = floorElement.querySelector('.down-button');
    }
  }
  
  
  // Function to animate lift movement from the current floor to the destination floor
// Function to animate lift movement from the current floor to the destination floor
function animateLift(liftIndex, currentFloor, destinationFloor) {
    const liftElement = document.getElementById(`lift-${liftIndex}`);
    const doorElement = liftElement.querySelector('.door');
    const floorHeight = 40; // Height of each floor in pixels
    const animationDuration = 1000; // Duration of the animation in milliseconds
    const doorOpenDelay = 2500; // Delay before opening the lift doors
    const doorCloseDelay = 2500; // Delay before closing the lift doors
  
    const targetPosition = (dataStore.numFloors - destinationFloor) * floorHeight;
  
    // Delay before opening the lift doors
    setTimeout(() => {
      liftElement.classList.add('open'); // Add class to open the lift doors
        console.log('doors are opening')
      // Delay before closing the lift doors
      setTimeout(() => {
          console.log('doors are closing')
        liftElement.classList.remove('open'); // Remove class to close the lift doors
  
        liftElement.style.transition = `top ${animationDuration}ms`;
        liftElement.style.top = `${targetPosition}px`;
  
        setTimeout(() => {
          // Animation completed
          liftElement.style.transition = '';
          dataStore.updateLiftPosition(liftIndex, destinationFloor);
          dataStore.updateLiftDirection(liftIndex, null);
          updateUI();
        }, animationDuration);
      }, doorCloseDelay);
    }, doorOpenDelay);
  
    updateUI();
  }
  
  
  
  
  
  // Function to request a lift to a specific floor with a given direction
  function requestLift(floor, direction) {
    const allocatedLiftIndex = liftControlEngine.allocateLift(floor, direction);
  
    if (allocatedLiftIndex !== -1) {
      console.log(`Lift ${allocatedLiftIndex} allocated for Floor ${floor}`);
    } else {
      console.log(`No available lifts for Floor ${floor}`);
    }
  }
  
  // Initialize the UI and update it with the initial state
  createFloors();
  updateUI();
  createLifts();

  