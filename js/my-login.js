$(function() {
	$("input[type='password'][data-eye]").each(function(i) {
		let $this = $(this);

		$this.wrap($("<div/>", {
			style: 'position:relative'
		}));
		$this.css({
			paddingRight: 60
		});
		$this.after($("<div/>", {
			html: 'Show',
			class: 'btn btn-primary btn-sm',
			id: 'passeye-toggle-'+i,
			style: 'position:absolute;right:10px;top:50%;transform:translate(0,-50%);padding: 2px 7px;font-size:12px;cursor:pointer;'
		}));
		$this.after($("<input/>", {
			type: 'hidden',
			id: 'passeye-' + i
		}));
		$this.on("keyup paste", function() {
			$("#passeye-"+i).val($(this).val());
		});
		$("#passeye-toggle-"+i).on("click", function() {
			if($this.hasClass("show")) {
				$this.attr('type', 'password');
				$this.removeClass("show");
				$(this).removeClass("btn-outline-primary");
			}else{
				$this.attr('type', 'text');
				$this.val($("#passeye-"+i).val());				
				$this.addClass("show");
				$(this).addClass("btn-outline-primary");
			}
		});
	});
	
	/*------------ LOGIN START ------------*/
	var server_url = 'http://127.0.0.1:3001/' //Server or domain url
	var token_type = 'Bearer';
	//var access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVHlwZSI6IkFkbWluIiwiZW1haWwiOiJyZWhhbjAxNEBnbWFpbC5jb20iLCJpYXQiOjE2ODM1MjYyODUsImV4cCI6MTY4MzYxMjY4NX0.EsC04VR3C1gMSTWAbhLF3lGrE6kLqX3q-D-f_bSKxO0';
	
	jQuery("#login-btn").click(function(){
		jQuery.ajax({
			type: "POST",  
			url : server_url + 'api/users/login',
			dataType: "JSON",
			data: JSON.stringify({
						"username": document.getElementById('email').value,
						"password": document.getElementById('password').value
					}),
			contentType: "application/json",
			success: function(data){
				console.log(data['token']);
				localStorage.setItem("access_token", data['token']);
				if(data['userType'] == 'doctor'){
					window.location.href = "http://localhost/final%20project/doctor_dashboard.html";
				}else if(data['userType'] == 'client'){
					window.location.href = "http://localhost/final%20project/user_dashboard.html";
				}else if(data['userType'] == 'Admin'){
					window.location.href = "http://localhost/final%20project/doctor_dashboard.html";
				}
				/*var dayoff = new Date(data['data']['date']);
				var dayoff_date = dayoff.toLocaleString('en-us',{month:'short', year:'numeric', day:'numeric'})
				document.getElementById('daysoff_area').innerHTML += '<tr id="'+data['data']['_id']+'">\
							<td style="border:1px solid #0e446d; ">'+dayoff_date+'</td>\
							<td style="border:1px solid #0e446d; width: 20px;"><button onclick="dayoff_delete(\''+str_id.toString()+'\')" style="margin: 5px;" class="btn">Delete</button></td>\
						</tr>';
				document.getElementById('msg').innerHTML = 'Added successfully!';
				setTimeout(function(){ document.getElementById('msg').innerHTML = "" }, 4000);*/
			}
		});
	});


/*------------ LOGIN END ------------*/

/*------------ SIGNUP START ------------*/

	jQuery("#register-btn").click(function(){
		jQuery.ajax({
			type: "POST",  
			url : server_url + 'api/users/signup',
			dataType: "JSON",
			data: JSON.stringify({
						"name": document.getElementById('name').value,
						"email": document.getElementById('email').value,
						"password": document.getElementById('password').value,
						"userType": "doctor"
					}),
			contentType: "application/json",
			success: function(data){
				console.log(data);
				window.location.href = "http://localhost/final%20project/index.html";
				/*var dayoff = new Date(data['data']['date']);
				var dayoff_date = dayoff.toLocaleString('en-us',{month:'short', year:'numeric', day:'numeric'})
				document.getElementById('daysoff_area').innerHTML += '<tr id="'+data['data']['_id']+'">\
							<td style="border:1px solid #0e446d; ">'+dayoff_date+'</td>\
							<td style="border:1px solid #0e446d; width: 20px;"><button onclick="dayoff_delete(\''+str_id.toString()+'\')" style="margin: 5px;" class="btn">Delete</button></td>\
						</tr>';
				document.getElementById('msg').innerHTML = 'Added successfully!';
				setTimeout(function(){ document.getElementById('msg').innerHTML = "" }, 4000);*/
			}
		});
	});


/*------------ SIGNUP END ------------*/

});