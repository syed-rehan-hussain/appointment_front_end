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

	if(data.userType == "client"){
		window.location.href = "http://localhost/final_project/user_dashboard.html";
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


/*------------ WEEKDAYS START ------------*/

	
	jQuery.ajax({
		type: "GET",	//get all weekdays hrs
		url : server_url + 'api/weekdays/'+data.id,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		success: function(data){
			for(var i=0; i < days.length; i++){
				for(var l = 0 ; l < data['data'].length; l++){
							
					if(data['data'][l]['dayindex'] == i+1){
						var array = data['data'][l]['time_arr'].split(",").map(Number);
							
						for(var j=0; j < 12; j++){
							for(var k =0; k <array.length; k++){
								if(array[k] == hours_AM[j]){
									document.getElementById(days[i]+'Check'+hours_AM[j]).checked = true;
								}
							}
						}
						
						for(var j=0; j < 12; j++){
							for(var k =0; k <array.length; k++){
								if(array[k] == hours_PM[j]){
									document.getElementById(days[i]+'Check'+hours_PM[j]).checked = true;
								}
							}
						}
					}
				}
			}
		},
		error: function(xhr, status, error){
			//Handle failure here
			console.log(error);

		}
	});

/*------------ WEEKDAYS END ------------*/


	
/*------------ DAYS OFF START ------------*/
	
	jQuery.ajax({
		type: "GET", //get all daysoff date
		url : server_url + 'api/daysoff/'+data.id,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		success: function(data){
			for(var i=0; i< data['data'].length; i++){
				var date_time = data['data'][i]['date']
				var dayoff = new Date(date_time);
				
				var str_id = data['data'][i]['_id'];
				var dayoff_date = dayoff.toLocaleString('en-us',{month:'short', year:'numeric', day:'numeric'})
				document.getElementById('daysoff_area').innerHTML += '<tr id="'+data['data'][i]['_id']+'">\
							<td style="border:1px solid #0e446d; ">'+dayoff_date+'</td>\
							<td style="border:1px solid #0e446d; width: 20px;"><button onclick="dayoff_delete(\''+str_id.toString()+'\')" style="margin: 5px;" class="btn">Delete</button></td>\
						</tr>';
			}
		},
		error: function(xhr, status, error){
		}
	});
	
	
	jQuery("#dayoff_submit").click(function(){
		jQuery.ajax({
			type: "POST",  //post daysoff date
			url : server_url + 'api/daysoff/',
			dataType: "JSON",
			data: JSON.stringify({
						"doctorId": data.id,
						"date": document.getElementById('dayoff_date').value
					}),
			contentType: "application/json",
			success: function(data){
				var str_id = data['data']['_id'];
				var dayoff = new Date(data['data']['date']);
				var dayoff_date = dayoff.toLocaleString('en-us',{month:'short', year:'numeric', day:'numeric'})
				document.getElementById('daysoff_area').innerHTML += '<tr id="'+data['data']['_id']+'">\
							<td style="border:1px solid #0e446d; ">'+dayoff_date+'</td>\
							<td style="border:1px solid #0e446d; width: 20px;"><button onclick="dayoff_delete(\''+str_id.toString()+'\')" style="margin: 5px;" class="btn">Delete</button></td>\
						</tr>';
				document.getElementById('msg').innerHTML = 'Added successfully!';
				setTimeout(function(){ document.getElementById('msg').innerHTML = "" }, 4000);
			}
		});
	});
	
	
/*------------ DAYS OFF END ------------*/

	
/*------------ APPOINTMENT START ------------*/
var earning = 0;
	function callApi2(serviceId,clientId,client_name, service_name, service_price, appoint_date,time,status) {
		
		jQuery.ajax({
			type: "GET", //get Client Name
			url : server_url + 'api/users/'+clientId,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			success: function(client){
				client_name = client['data'];
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
						
						document.getElementById('tearning').innerHTML = earning;
						table = jQuery('#example').DataTable(); 
						var num = parseInt(time)+1;
						if(Number(time) < 9){
							time = time+":00 AM -- "+ "0" + num +":00 AM";
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
						table.row.add([ client_name, service_name, service_price, appoint_date,time,status ]);
						table.draw();
					}
				});
				
			}
		});
	}

	
	jQuery.ajax({
		type: "GET", //get all appointment
		url : server_url + 'api/appointments/'+data.id,
		
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		success: function(dataresult){
			var doctor_name = '';
			var client_name = '';
			var service_name = '';
			var service_price = '';
			var data = dataresult;
		
				document.getElementById('tsession').innerHTML = data['data'].length;
				document.getElementById('appointment_table').innerHTML = '';
				for(var i=0; i< data['data'].length; i++){
					var date_time = data['data'][i]['date'];
					var app_date = new Date(date_time);
					var appoint_date = app_date.toLocaleString('en-us',{month:'short', year:'numeric', day:'numeric'});
					var time = data['data'][i]['time'];
					var status = data['data'][i]['status'];
					var serviceId = data['data'][i]['serviceId'];
					var clientId = data['data'][i]['clientId'];
					
					callApi2(serviceId, clientId, client_name, service_name, service_price, appoint_date,time,status);
				}
				jQuery('#example').DataTable({
					pagingType: 'full_numbers',
				});
				
		},
		error: function(xhr, status, error){
		}
	});
	
/*------------ APPOINTMENT END ------------*/
	
	
});