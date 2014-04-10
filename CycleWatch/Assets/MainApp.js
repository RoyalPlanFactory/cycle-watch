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

var counterFullCycleAmount : float;
var counterCurrentCycleAmount : float;

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
  counterCurrentCycleAmount = counterFullCycleAmount;
  
  counterText.text = formatCounterText(counterCurrentCycleAmount);
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
  
  GUI.Label(Rect(boxMargins, boxMargins, boxWidth, boxHeight), appTitle);
  GUI.DrawTexture(Rect(boxWidth - (logoSize/2) - logoPositionAdjust, (logoSize/2) - logoPositionAdjust, logoSize, logoSize), RPFLogo, ScaleMode.StretchToFill, true, 0);
  
  displayStringPositionX = 30;
  displayStringPositionY = 90;
  
  for(i = 0; i < displayStrings.Count; i++){
    GUI.Label(Rect(displayStringPositionX, displayStringPositionY + (i*inputFieldGap), Screen.width, Screen.height), displayStrings[i]);
    inputStrings[i] = GUI.TextField(Rect(displayStringPositionX + inputFieldPositionAdjust, displayStringPositionY + (i*inputFieldGap), inputFieldWidth, 20), inputStrings[i]);
  }
  
  GUI.Button(Rect(buttonPosX, buttonPosY, buttonWidth, buttonHeight), buttonStrings[0]); 
  
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
 *  Formats the counter's number to an easily readable format
 */
function formatCounterText(amount : float){
  var formattedText : String;
  formattedText = amount.ToString();
  formattedText += ".0s";
  
  return formattedText;
}
