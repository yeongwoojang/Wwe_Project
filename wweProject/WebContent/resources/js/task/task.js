let feedBack = ()=>{
	
	const url = "/task/insertfeedback"
	let paramObj = new Object();
	paramObj.taskId = document.querySelector('#taskId').innerHTML;
	paramObj.tIdx = document.querySelector('#tIdx').innerHTML;
	paramObj.feedbackComment = document.getElementById('feedbackComment').value;

	let headerObj = new Headers();
	headerObj.append('content-type','application/x-www-form-urlencoded');
	
	fetch(url,{
		method : "POST",
		headers : headerObj,
		body : "data="+JSON.stringify(paramObj)
	}).then(response=>{
		if(response.ok){
			return response.text();
		}else{
			throw new AsyncPageError(response.text());
		}
	}).then(msg =>{
		if(msg){
			console.dir('완료');
			selectFeedback();
		}else{
			console.dir('실패');
		}
	})
}

let selectFeedback = () =>{
	
	
}
	
let calendar = () => {
	
   let today = new Date();
   let year = today.getFullYear();
   let month = ("0"+(1+today.getMonth())).slice(-2);
   let day = ("0" + today.getDate()).slice(-2);
   
   today = new Date(year, month-1, day);
   let tempArr = modDeadLine.split('-');
   let modDate = new Date(tempArr[0], tempArr[1]-1, tempArr[2]);
   let betweenDay = (modDate.getTime() - today.getTime())/1000/60/60/24;
   
   if(betweenDay<0){
      alert("변경할 수 없는 날짜입니다.");
   }
}
	
	
	
	