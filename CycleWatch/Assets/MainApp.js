/**
 *  This project is licensed under 
 *  Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International 
 *  (CC BY-NC-SA 4.0)
 *  See more on < https://creativecommons.org/licenses/by-nc-sa/4.0/ >
 *  
 *  Furthermore we take no responsibility for any damage this project might cause.
 *  Use, fork, improve this project on your own behalf. 
 *  Royal Plan Factory, 2014 < http://rpfactory.net >
 */


#pragma strict
import System.Collections.Generic;

var appName : String;
var appVersion : String;
var appTitle : String;

var boxMargins : int;
var boxWidth : int;
var boxHeight : int;

var logoSize : int;
var logoPositionAdjust : int;

var displayStrings = new List.<String>();
var displayStringPositionX : int;
var displayStringPositionY : int;

var inputStrings = new List.<String>();

var inputFieldPositionAdjust : int;
var inputFieldWidth : int;

var inputFieldGap : int;

var buttonPosX : int;
var buttonPosY : int;
var buttonWidth : int;
var buttonHeight : int;
var buttonStrings = new List.<String>();

var counterText : GUIText;
var fullCycleText : GUIText;
var descriptionText : GUIText;

var counterFullCycleAmount : float;
var counterCurrentFullCycleAmount : float;

var counterCurrentCycleAmount : float;
var counterFirstCycleLength : float;
var counterSecondCycleLength : float;
var counterCurrentCycleId : int;

var programPhase : int;

var i : int;
var RPFLogo : Texture;

function Start () {
  fillDisplayTexts();
  appTitle = "\n" + appName + "\n(" + appVersion + ")";
  
  boxMargins = 20;
  
  inputFieldGap = 30;
  
  logoSize = 50;
  logoPositionAdjust = logoSize/10;
  
  inputFieldPositionAdjust = 180;
  
  buttonHeight = 50;
  counterFullCycleAmount = 0;
  counterCurrentFullCycleAmount = counterFullCycleAmount;
  
  counterFirstCycleLength = 0;
  counterSecondCycleLength = 0;
  counterCurrentCycleAmount = 0;
  counterCurrentCycleId = 0;
  
  hideAllText();
  programPhase = 1;
}

function Update () {
  boxWidth = Screen.width-(boxMargins*2);
  boxHeight = Screen.height-(boxMargins*2);
  
  buttonPosX = boxMargins + 10;
  buttonPosY = boxHeight - buttonHeight + boxMargins - 5;
  buttonWidth = boxWidth - boxMargins;
  
  inputFieldWidth = Screen.width - inputFieldPositionAdjust - (boxMargins*3);

  counterText.fontSize = fontResize(80);
  
}

/**
 *  The GUI the user sees.
 */
function OnGUI(){
  basicDesign();
  
  switch(programPhase){
   //Main Screen
   case 1 : 
     inputCycleScreen();
   break;
   
   //Counter Screen
   case 2 : 
     counterScreen();
     counterSystem();
   break;
  }
  
}

/**
 *  Every text shown by the program is stored here.
 *  Further development will be easier this way (e.g. localization files)
 */

function fillDisplayTexts() {
  appName = "Cycle Watch";
  appVersion = "v0.0.1";
  
  displayStrings.Add("Full Cycle Length (sec): ");
  displayStrings.Add("First Part Length (sec): ");
  displayStrings.Add("Second Part Length (sec): ");
  
  inputStrings.Add("1200");
  inputStrings.Add("60");
  inputStrings.Add("90");
  
  buttonStrings.Add("Start");
  buttonStrings.Add("Stop");
}

function fontResize(baseFontSize : int) {
  var newFontSize : int;
  newFontSize = baseFontSize - (320 / (Screen.width / 20) * 2);
  if(newFontSize <= 5){
    newFontSize = 5;
  }
  
  return newFontSize;
}

/**
 *  Only can be called by the OnGUI
 *  Basic Design which can be seen in every phase of the Application.
 */
function basicDesign(){
  GUI.Label(Rect(boxMargins, boxMargins, boxWidth, boxHeight), appTitle);
  GUI.DrawTexture(Rect(boxWidth - (logoSize/2) - logoPositionAdjust, (logoSize/2) - logoPositionAdjust, logoSize, logoSize), RPFLogo, ScaleMode.StretchToFill, true, 0);
}

/**
 *  Only can be called by the OnGUI
 *  The app's main screen where the user can set up the cycles.
 */
function inputCycleScreen(){
  displayStringPositionX = 30;
  displayStringPositionY = 90;
  
  for(i = 0; i < displayStrings.Count; i++){
    GUI.Label(Rect(displayStringPositionX, displayStringPositionY + (i*inputFieldGap), Screen.width, Screen.height), displayStrings[i]);
    inputStrings[i] = GUI.TextField(Rect(displayStringPositionX + inputFieldPositionAdjust, displayStringPositionY + (i*inputFieldGap), inputFieldWidth, 20), inputStrings[i]);
  }
  
  if(GUI.Button(Rect(buttonPosX, buttonPosY, buttonWidth, buttonHeight), buttonStrings[0])){  
    counterFirstCycleLength = System.Int32.Parse(inputStrings[1]);
    counterSecondCycleLength = System.Int32.Parse(inputStrings[2]);
    counterCurrentCycleAmount = counterFirstCycleLength;
    
    counterFullCycleAmount = System.Int32.Parse(inputStrings[0]);
    counterCurrentFullCycleAmount = counterFullCycleAmount;
    counterCurrentCycleId = 1;
    programPhase = 2;
  } 
}

/**
 *  Only can be called by the OnGUI
 *  The actual counter's screen with other infos.
 */
function counterScreen(){
  setCounterTexts();
  counterText.text = formatCounterText(counterCurrentCycleAmount);
  
  if(GUI.Button(Rect(buttonPosX, buttonPosY, buttonWidth, buttonHeight), buttonStrings[1])){
    hideAllText();
    counterCurrentCycleId = 0;
    programPhase = 1;
  }
}

/**
 *  Formats the counter's number to an easily readable format
 */
function formatCounterText(amount : float){
  var formattedText : String;
  formattedText = amount.ToString();
  formattedText += "s";
  
  return formattedText;
}

/**
 *  Hides all unnecessary texts
 */
function hideAllText(){
  counterText.text = "";
  fullCycleText.text = "";
  descriptionText.text = ""; 
}

/**
 *  Sets the counter texts
 */ 
function setCounterTexts(){
  counterText.text = formatCounterText(counterCurrentCycleAmount);
  fullCycleText.text = formatCounterText(counterCurrentFullCycleAmount);
  descriptionText.text = "DESCRIPTION";
}

/**
 *  Calculates the counting mechanism
 */
function counterSystem(){
  counterCurrentFullCycleAmount -= Time.deltaTime;
  counterCurrentFullCycleAmount = clampFloatTo2DP(counterCurrentFullCycleAmount);
  
  if(counterCurrentFullCycleAmount > 0){
    counterCurrentCycleAmount -= Time.deltaTime;
    counterCurrentCycleAmount = clampFloatTo2DP(counterCurrentCycleAmount);
    if(counterCurrentCycleAmount <= 0){
      switch(counterCurrentCycleId){
        case 1 : 
          counterCurrentCycleAmount = counterSecondCycleLength;
          counterCurrentCycleId = 2;
        break;
        case 2 : 
          counterCurrentCycleAmount = counterFirstCycleLength;
          counterCurrentCycleId = 1;
        break;
      }
    }
  }
  else{
    hideAllText();
    programPhase = 1;
  }
}

/**
 *  Clamps a float number up to 3 decimal places
 *  Returns rounded float.
 */ 
function clampFloatTo2DP(number : float){
  var tmp : int;
  number *= 1000;
  tmp = number;
  number = tmp;
  number /= 1000;
  return number;
}

