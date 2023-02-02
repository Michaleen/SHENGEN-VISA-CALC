// Utility class with static methods for generic functionalities
class utility {

// static method creates an HTML element
static createElement(element) {
  return document.createElement(element)
}

// static method to set date attribute to some input field
static setDateAttribute(element) {
  element.setAttribute("type", "date")
}

// This static method, which is trigerred at the press of the "Add trip(s)" button, does most of the processing for adding input fields for dates to the HTML page
static addTrip() {
  const myElements = ["div", "input", "label"].map(element => utility.createElement(element))

  utility.setDateAttribute(myElements[1])

  myElements[0].append(myElements[1], myElements[1].cloneNode(), myElements[2])

  document.forms[0].append(myElements[0])
}

// static method for disabling a button
static disableButton(position) {
  document.querySelectorAll("button")[position].disabled = "true"
}

// static method for adding text to a label
static addTextToLabel(element, text) {
  element.innerHTML = text
}

// static method to return a node element or list
static querySelectorAll(element, node) {

  if (node === undefined) {
    node = document
  }

  return node.querySelectorAll(element)
}

}


// Calculator object containing various methods to do the processing and calculation
const myCalculator = {

// Main work is processed in this method, called when  the "Calculate" button clicked
calculate() {
  const myTrips = utility.querySelectorAll("div"),
    today180DaysAgo = this.go180DaysBack()

  let myArray, endDateOfPreviousTrip, errorCatcher, successLabel, totalTripsLength = 0

  myTrips.forEach(function(currentTrip) {
    const myDates = utility.querySelectorAll("input", currentTrip),
      currentLabel = utility.querySelectorAll("label", currentTrip)[0]

    if (typeof(myArray) !== "undefined") {
      endDateOfPreviousTrip = myArray[1]
    }

    myArray = Array.from(myDates, function(currentDate) {
      return new Date(currentDate.value).getTime()
    })

    errorCatcher = this.validateInput(myArray, endDateOfPreviousTrip)

    if (errorCatcher === 0) {
      myArray[0] = myArray[0] < today180DaysAgo ? today180DaysAgo : myArray[0]
      const currentTripLength = this.calculateCurrentTripLength(myArray)
      totalTripsLength += currentTripLength
      successLabel = `${currentTripLength} ${currentTripLength < 2 ? "day" : "days"}`
      errorCatcher = successLabel
    }

    utility.addTextToLabel(currentLabel, errorCatcher)

  }, this)

  utility.disableButton(0)

  if (errorCatcher === successLabel) {
    const myDates = utility.querySelectorAll("input")
    const finalExitDate = myDates[myDates.length - 1]
    const finalExitTime = new Date(finalExitDate.value).getTime()
    const nextEntryForFull90Days = this.go92DaysAheadFromLastExitDate(finalExitTime)
    console.log(finalExitTime, nextEntryForFull90Days)
    this.setFinalResult(totalTripsLength, today180DaysAgo)
  }
},

// method to calculate the length of the current trip
calculateCurrentTripLength(myArray) {
  return (myArray[1] - myArray[0]) / 86400000 + 1
},

// method to validate input, returns relevant error message, else returns 0
validateInput(inputs, endDateOfPreviousTrip) {
  const errorText = [" Please enter both start and end dates for your trip!", " End date cannot be before start date!", " Please correct the dates as the end date of the previous trip is after, or the same as, the start date of the current trip! If entering and exiting a country on the same day, please make this as a single trip."]

  if (isNaN(inputs[0]) || (isNaN(inputs[1]))) {
    return errorText[0]
  } else if (inputs[1] < inputs[0]) {
    return errorText[1]
  } else if (inputs[0] <= endDateOfPreviousTrip) {
    return errorText[2]
  } else {
    return 0
  }
},

// method to set the final result and adds related texts to the final labels
setFinalResult(total, today180DaysAgo) {
  const myFinalParagraphs = ["p", "p", "p"].map(element => utility.createElement(element)),
    myFinalLabels = ["label", "label", "label"].map(element => utility.createElement(element)),
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    today180DaysAgoInDate = new Date(today180DaysAgo),
    myFinalLabelsText = [`You have spent a total of ${total} ${total < 2 ? "day" : "days"} since ${days[today180DaysAgoInDate.getDay()]}, ${today180DaysAgoInDate.getDate()} ${months[today180DaysAgoInDate.getMonth()]} ${today180DaysAgoInDate.getFullYear()} (180 days ago).`, `Therefore ${90 - total < 0 ? 0 : 90 - total} ${90 - total < 2 ? "day remains" : "days remain"} for your next trip!`]

  for (let x = 0; x < 2; x++) {
    utility.addTextToLabel(myFinalLabels[x], myFinalLabelsText[x])
    myFinalParagraphs[x].appendChild(myFinalLabels[x])
    document.body.appendChild(myFinalParagraphs[x])
  }
},

// method to calculates 180 days ago
go180DaysBack() {
  const today = Date.now(),
    todayInMilliseconds = today - (today % 86400000)

  return todayInMilliseconds - 180 * 86400000
},

go92DaysAheadFromLastExitDate(finalExitTime) {
  return finalExitTime + 92 * 86400000
}
}
