jQuery(document).ready(function(){
// Update appoinment start

	var server_url = 'http://127.0.0.1:3001/' //Server or domain url
	var token_type = 'Bearer';
	var access_token = localStorage.getItem("access_token");
	
	var token = localStorage.getItem("access_token");
	var data = tokenjwt(token);
	
	function tokenjwt(tkn){
		try {
			return JSON.parse(atob(tkn.split('.')[1]));
		} catch (e) {
			return null;
		}
	}

	console.log(data.userType);
	if(data.userType == "doctor"){
		window.location.href = "http://localhost/final_project/doctor_dashboard.html";
	}



/*------------ USER START ------------*/

	jQuery.ajax({
		type: "GET",	//get user profile
		url : server_url + 'api/users/doctor/'+data.id,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		success: function(data){
			document.getElementById('email').value = data['data']['email'];
			document.getElementById('phone').value = data['data']['phoneNumber'];
			if(data['data']['userAddress']){
				document.getElementById('userAddress').value = data['data']['userAddress'];
			}
			if(data['data']['gender'] == "male"){
				document.getElementById('male').checked = true;
			}
			if(data['data']['gender'] == "female"){
				document.getElementById('female').checked = true;
			}
		}
	});
	
	jQuery("#updateprofile").click(function(){
		var male="unidentified";
		if(document.getElementById('male').checked){
			 male = "male";
		}
		if(document.getElementById('female').checked){
			male = "female";
		}
		console.log();
		jQuery.ajax({
			type: "PUT",
			url : server_url + 'api/users/doctor/'+data.id,
			dataType: "JSON",
			data: JSON.stringify({
				"email": document.getElementById('email').value,
				"phoneNumber": document.getElementById('phone').value,
				"userAddress": document.getElementById('userAddress').value,
				"gender": male,
			}),
			
			contentType: "application/json",
			success: function(data){
				console.log(data);
				document.getElementById('updmsg').innerHTML = 'Updated Successfully!';
				setTimeout(function(){ document.getElementById('updmsg').innerHTML = "" }, 4000);
			}
		});
	});


/*------------ USER END ------------*/



	
/*------------ APPOINTMENT START ------------*/
var earning = 0;
	function callApi2(serviceId,doctorId,doctor_name, service_name, service_price, appoint_date,time,status) {
		
		jQuery.ajax({
			type: "GET", //get doctor Name
			url : server_url + 'api/users/'+doctorId,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			success: function(doctor){
				doctor_name = doctor['data'];
				console.log(time);
				//get Service Name
				jQuery.ajax({
					type: "GET", //get Service Name
					url : server_url + 'api/services/'+serviceId,
					headers: {
						'Access-Control-Allow-Origin': '*',
					},
					success: function(service){
						service_name = service['data']['name'];
						service_price = service['data']['price'];
						earning = earning + service_price;
						var PM = "PM";
						document.getElementById('tearning').innerHTML = earning;
						table = jQuery('#example1').DataTable(); 
						var num = parseInt(time)+1;
						if(Number(time) < 9){
							time = "0"+time+":00 AM -- "+ num +":00 AM";
						}else if(Number(time) > 9 && Number(time) < 13){
							if(num == 12){
								time = time+":00 AM -- "+ num +":00 PM";
							}else{
								time = time+":00 AM -- "+ num +":00 AM";
							}
						}else{
							if(num == 25){
								num = "0"+1;
								time = time+":00 PM -- "+ num +":00 AM";
							}else{
								time = time+":00 PM -- "+ num +":00 PM";
							}
						}
						table.row.add([ doctor_name, service_name, service_price, appoint_date,time,status ]);
						table.draw();
					}
				});
				
			}
		});
	}

	
	jQuery.ajax({
		type: "GET", //get all appointment
		url : server_url + 'api/appointments/client/'+data.id,
		
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		success: function(dataresult){
			var doctor_name = '';
			var client_name = '';
			var service_name = '';
			var service_price = '';
			var data = dataresult;
			console.log(data);
			//jQuery(document).ready(function () {
		
				document.getElementById('tsession').innerHTML = data['data'].length;
				document.getElementById('appointment_table').innerHTML = '';
				for(var i=0; i< data['data'].length; i++){
					var date_time = data['data'][i]['date'];
					var app_date = new Date(date_time);
					var appoint_date = app_date.toLocaleString('en-us',{month:'short', year:'numeric', day:'numeric'});
					var time = data['data'][i]['time'];
					var status = data['data'][i]['status'];
					var serviceId = data['data'][i]['serviceId'];
					var doctorId = data['data'][i]['doctorId'];
					
					callApi2(serviceId, doctorId, doctor_name, service_name, service_price, appoint_date,time,status);
				}
				jQuery('#example').DataTable({
					pagingType: 'full_numbers',
				});
				
			//});
		},
		error: function(xhr, status, error){
		}
	});
	
/*------------ APPOINTMENT END ------------*/
	
	
});