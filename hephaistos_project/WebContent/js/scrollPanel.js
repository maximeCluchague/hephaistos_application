
(function () {

	var scrollContainer = document.querySelector('.scrollable'),
	    scrollContentWrapper = document.querySelector('.scrollable .content-wrapper'),
	    scrollContent = document.querySelector('.scrollable .content'),
	    contentPosition = 0,
	    scrollerBeingDragged = false,
	    scroller,
	    topPosition,
	    scrollerHeight;

	function calculateScrollerHeight() {
	    // *Calculation of how tall scroller should be
	    var visibleRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
	    return visibleRatio * scrollContainer.offsetHeight;
	}

	function moveScroller(evt) {
	    // Move Scroll bar to top offset
	    var scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
	    topPosition = scrollPercentage * (scrollContainer.offsetHeight - 5); // 5px arbitrary offset so scroll bar doesn't move too far beyond content wrapper bounding box
	    scroller.style.top = topPosition + 'px';
	}

	function startDrag(evt) {
	    normalizedPosition = evt.pageY;
	    contentPosition = scrollContentWrapper.scrollTop;
	    scrollerBeingDragged = true;
	}

	function stopDrag(evt) {
	    scrollerBeingDragged = false;
	}

	function scrollBarScroll(evt) {
	    if (scrollerBeingDragged === true) {
	        var mouseDifferential = evt.pageY - normalizedPosition;
	        var scrollEquivalent = mouseDifferential * (scrollContentWrapper.scrollHeight / scrollContainer.offsetHeight);
	        scrollContentWrapper.scrollTop = contentPosition + scrollEquivalent;
	    }
	}

	function createScroller() {
	    // *Creates scroller element and appends to '.scrollable' div
	    // create scroller element
	    scroller = document.createElement("div");
	    scroller.className = 'scroller';

	    // determine how big scroller should be based on content
	    scrollerHeight = calculateScrollerHeight();

	    if (scrollerHeight / scrollContainer.offsetHeight < 1){
	        // *If there is a need to have scroll bar based on content size
	        scroller.style.height = scrollerHeight + 'px';

	        // append scroller to scrollContainer div
	        scrollContainer.appendChild(scroller);

	        // show scroll path divot
	        scrollContainer.className += ' showScroll';

	        // attach related draggable listeners
	        scroller.addEventListener('mousedown', startDrag);
	        window.addEventListener('mouseup', stopDrag);
	        window.addEventListener('mousemove', scrollBarScroll)
	    }

	}

	createScroller();
})
