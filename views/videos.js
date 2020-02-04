let apiKey ="AIzaSyAcKLhpH7cTTbsrl5T9J_5oISNKiuMmMUo";
let url ="https://www.googleapis.com/youtube/v3/search?";
let prev_Page ="";
let next_Page ="";

function searchVideo()
{
	$("#submitButton").on("click", (event)=>{
		event.preventDefault();
		let inputVideo=$("#search").val();
		$.ajax({
			url : url,
			data:{
				part: "snippet",
				q:inputVideo,
				maxResults:10,
				type: "video",
				key: apiKey
			},
			method : "GET",
			dataType: "json",
			success : function(responseJSON) {
				prev_Page=responseJSON.prevPageToken;
				next_Page=responseJSON.nextPageToken;
				displayResults(responseJSON, prev_Page, next_Page);
			},
			error: function(err){
				displayError(err);
			}
		});
	});
}

function nextPage()
{
	$("#nextButton").on("click", (event)=>{
		event.preventDefault();
		let inputVideo=$("#search").val();
		$.ajax({
			url : url,
			data:{
				part: "snippet",
				maxResults: 10,
				q : inputVideo,
				pageToken: next_Page,
				type:"video",
				key: apiKey
			},
			method : "GET",
			dataType : "json",
			success : function(responseJSON){
				prev_Page=responseJSON.prevPageToken;
				next_Page=responseJSON.nextPageToken;
				displayResults(responseJSON, prev_Page, next_Page);
			},
			error : function(err){
				displayError(err);
			}
		});
	});
}

function previousPage()
{
	$("#prevButton").on("click", (event)=>{
		event.preventDefault();
		let inputVideo=$("#search").val();
		$.ajax({
			url : url,
			data:{
				q : inputVideo,
				maxResults : 10,
				part : "snippet",
				type : "video",
				pageToken : prev_Page,
				key : apiKey
			},
			method : "GET",
			dataType : "json",
			success : function(responseJSON){
				prev_Page=responseJSON.prevPageToken;
				next_Page=responseJSON.nextPageToken;
				displayResults(responseJSON, prev_Page, next_Page);
			},
			error : function(err){
				displayError(err);
			}
		});
	});
}

function displayResults(responseJSON, prevPage, nextPage)
{
	$("#resultVideos").empty();
	console.log(responseJSON);
	for(let i=0; i<responseJSON.items.length; i++)
	{
		$("#resultVideos").append(`
			<div class=videoContainer> 
				<a href="https://www.youtube.com/watch?v=${responseJSON.items[i].id.videoId}" target="_blank"> 
				<h2 class="title">${responseJSON.items[i].snippet.title}</h2>
				<img src="${responseJSON.items[i].snippet.thumbnails.medium.url}" alt="Video" /> </a>
		    </div>`);
		$("#resultVideos").css("border", "3px solid #CF0505");
	}

	if(prev_Page === undefined)
		$("#prevButton").css("display", "none");
	else
		$("#prevButton").css("display", "inline");
	

	if(next_Page === undefined)
		$("#nextButton").css("display", "none");
	else
		$("#nextButton").css("display", "inline");
	
}

function displayError(err)
{
	$("#resultVideos").append(`<span>Something went wrong</span>`);
	console.log(err); 
}

function init()
{
	searchVideo();
	previousPage();
	nextPage();
}

init();