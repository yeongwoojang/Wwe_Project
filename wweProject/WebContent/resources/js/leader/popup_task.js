	
	let userId; 
	
	// 팝업 띄우기
		$('#btn_open_invite_modal').click(function(e) {
			$('#invite_modal').show();
			
		});
		// 팝업 닫기
		$('#btn_invite_close').click(function(e) {
            document.querySelector('#idChk').innerHTML ="";
            $('#userId').val(" ");
			$('#invite_modal').hide();
		});
		
		$(document).on("click","#btn_open_modify_modal",function(e){
			userIdList = document.querySelectorAll('#userTd');
			let seq = e.target.parentElement.parentElement.getAttribute("seq");
			userIdList.forEach((e,i)=>{
				if(e.parentElement.getAttribute("seq")==seq ){
					userId = e.childNodes[0].nodeValue;
					console.dir(e);
				}
			});
			$("#modify_modal").show();
		});
		$(document).on("click","#btn_modify_close",function(e){
			let radio = document.getElementsByName('mod_authority');
			for(i =0;i<radio.length;i++){
				if(i==0){
					radio[0].checked=true;
				}else{
					radio[i].checked = false;
				}
			}
			$('#modify_modal').hide();
		});
		
        let idCheck = ()=>{
          let userId = $('#userId').val();
            let headerObj = new Headers();
            headerObj.append('content-type','application/x-www-form-urlencoded');
            if(userId){
                fetch("/leader/chkuser?userId="+userId,{
                    method : "GET",
                    headers : headerObj
                }).then(response=>{
                    if(response.ok){
                        return response.text();
                    }
                    throw new AsyncPageError(response.text());
                }).then((msg)=>{
                    if(msg=='success'){
                       inviteUser();
                    }else{
                        document.querySelector('#idChk').innerHTML = '유효하지 않은 아이디입니다.';
                    }
                }).catch(error=>{
                    error.alertMessage();
                });
            }
        }

		let inviteUser = ()=>{
            let url = "/leader/inviteimpl";
            let paramObj = new Object();
            paramObj.userId = $('#userId').val();
			
            paramObj.authority = authorityChk("authority");

            let headerObj = new Headers();
            headerObj.append('content-type', 'application/x-www-form-urlencoded');
            fetch(url,{
                method : "POST",
                headers : headerObj,
                body : "data=" + JSON.stringify(paramObj)
            }).then(response=>{
                //http상태코드가 200~299사이라면 true를 반환
                if(response.ok){
                    return response.text();
                }
                throw new AsyncPageError(response.text());
            }).then(msg=>{
                if(msg=='success'){
	    		$('#userId').val(" ");
				$('#popup_modal').hide();
                    alert('유저를 초대했습니다.');
                }else{
                    alert('유저를 초대하지 못했습니다.');
                }
				reloadPage();
            }).catch(error=>{
                error.alertMessage();
            });
        }
        
        let authorityChk = (authority)=>{
            let radioChk = document.getElementsByName(authority);
            //라디오 버튼이 체크되었나 확인하기 위한 변수
            let radio_btn_chk = 0;
            for(let i = 0; radioChk.length;i++){
                //만약 라디오 버튼이 체크되었으면 true
                if(radioChk[i].checked==true){
                    //라디오 버튼 값 반환
					console.log(radioChk[i].value);
                    return radioChk[i].value;
                }
            }
        }

	
	
		let updateAuthority = ()=>{
		
		let url = "/leader/updateauthority"
		let paramObj = new Object();
		let projectId = "프로젝트 1" //임의로 정한 프로젝트ID값, 추후에 세션값으로 처리해야할 듯
		let authority = authorityChk("mod_authority");
		
		paramObj.projectId = projectId;
		paramObj.userId = userId;
		paramObj.authority = authority;
		
		let headerObj = new Headers();
		headerObj.append('content-type', 'application/x-www-form-urlencoded');
		     fetch(url,{
                method : "POST",
                headers : headerObj,
                body : "data=" + JSON.stringify(paramObj)
            }).then(response=>{
                //http상태코드가 200~299사이라면 true를 반환
                if(response.ok){
                    return response.text();
                }
                throw new AsyncPageError(response.text());
            }).then(msg=>{
                if(msg=='success'){
					alert("유저의 권한을 변경했습니다.")
					
                }else{
                    alert('유저를 권한을 변경하지 못했습니다.');
                }
				reloadPage();				 
            }).catch(error=>{
                error.alertMessage();
            });
	}
	
	//페이지를 새로고침하는 함수
	let reloadPage = ()=>{
		location.reload();
	}
	
	
	
	
	
	
	
	
	