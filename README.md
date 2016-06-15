# PairedResultGraph

### Paired Results Graphing using D3. Primary usage will be for BP but potentially can be used for charting any paired result i.e. given high's, low's, and a date/time combination 

#### 1. Demo
```
 python -m http.server 8888
 Open browser
 Open: http://localhost:8888/index.html
```

----
#### 2. Pending
* Box graph colouring?
* Zoom functionality
* Bind to an id rather than "body", get user input
* Create uid's for each module and assign it to the svg's and g's
* Date formatting based on UTC
* i18n's for tooltip values?
* Mark publicly exposed functions to setup the properties
* Setup defaults if the public functions arent honoured. 
* Bonus - Add trend-lines iff both points are present
* Unit testing and Coverage details
* Namespace graphs
* Legends
* Loader function to load data into the canvas
* User inputs needed for:
	* x - Date/time
	* y1 - SBP 
	* y2 - DBP
	* MAP formula
	* onhover callback
	* ID housing the graph
	* Format for showing the date in x-axis
	* Enable zoom functionality or not
	* Enable trend-line or not?
	* Container width for the graph
	* Container height for the graph
			
----
#### 3. Completed
* Add basic graph plots given high, low and date/time
* Add MAP by axis aligning a rect (square)
* Add lines in between the high and low plots
* ``` MAP = (SBP + 2 (DBP))/3 ```
* Hover tooltips
* Responsive graphing/RWR (resize without repaint)
* Added Axis labels
* Added clip-path for Zoom
* Don't create vline if both points aren't provided but only the whisker
* Don't create median point if both points points aren't provided
* Handle case for overlapping data points
* Handle case for very close points - SBP and DBP within a range of 4