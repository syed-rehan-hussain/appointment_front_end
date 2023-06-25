
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
        
    
// Therapist get Api Start

jQuery.ajax({
    type: "GET",	//get all therapist
    url : server_url + 'api/users/',
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    success: function(data){
	   for(let i = 0; i < data['data'].length; i++){
		   document.getElementById('therapistid').innerHTML += '<option value="'+data['data'][i]['_id']+'">'+data['data'][i]['name']+'</option>';
	   }

    },
    error: function(xhr, status, error){
        //Handle failure here
        console.log(error);

    }
});

// Therapist get Api End


// Services Api Start

jQuery.ajax({
    type: "GET",	//get all Services
    url : server_url + 'api/services/',
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    success: function(data){
	   for(let i = 0; i < data['data'].length; i++){
		   document.getElementById('serviceId').innerHTML += '<option value="'+data['data'][i]['_id']+'">'+data['data'][i]['name']+' -------- '+data['data'][i]['price']+' pkr</option>';
	   }

    //    document.getElementById('therapistid').innerHTML += '<option value="51">Doctor01</option>';
    },
    error: function(xhr, status, error){
        //Handle failure here
        console.log(error);

    }
});

// Services Api End




var datesForDisable = [];
// disable daysoff date start
jQuery( "#therapistid").on( "change", function(e) {
    jQuery.ajax({
        type: "GET",
        url : server_url + 'api/daysoff/'+document.getElementById('therapistid').value,
        success: function(res){
			for(let i = 0; i< res['data'].length; i++){
				var date = new Date(res['data'][i]['date']);
				var month = date.getMonth()+1;
				var currentDate = date.getFullYear()+'-'+month+'-'+date.getDate();
				datesForDisable[i] = currentDate;
			}
            var sdate = new Date();
            sdate.setDate(sdate.getDate());
			
            jQuery('#bookingstart').datepicker({
                startDate: sdate,
                format: 'yyyy-mm-dd',
                inline: false,
                autoclose: true,
                todayHighlight: true,
                //daysOfWeekDisabled: res.daysoff,
				datesDisabled: datesForDisable,
                minDate: 0,
             });
        }
    });
});
// disable daysoff date end


// Update time using date select in appoinment booking start
    jQuery( "#app_time").on( "change", function(e) {
        var z = document.getElementById('app_time').value;
		if(z<9){
			var y = "0"+(parseInt(z)+1);
		}else{
			var y = parseInt(z)+1;
			if(y == 25){
				y = 1;
			}
		}
            document.getElementById('apptime').innerHTML = z + ":00 ---- "+ y +":00";
    });

    
    jQuery( "#bookingstart").on( "change", function(e) {
        e.preventDefault();
        document.getElementById('app_time').innerHTML = '';
        var date = new Date(document.getElementById('bookingstart').value);
        var day = date.toLocaleDateString(locale = 'en-US', {weekday: 'long'});
		console.log(day);
        if(day == 'Monday')
            var day_index = 1;
        else if (day == 'Tuesday')
            var day_index = 2;
        else if (day == 'Wednesday')
            var day_index = 3;
        else if (day == 'Thursday')
            var day_index = 4;
        else if (day == 'Friday')
            var day_index = 5;
        else if (day == 'Saturday')
            var day_index = 6;
        else if (day == 'Sunday')
            var day_index = 7;
        jQuery.ajax({
            type: "Get",
            url : server_url + 'api/weekdays/'+document.getElementById('therapistid').value,
           
            success: function(response){
				for(let j = 0; j < response['data'].length; j++){
					if(response['data'][j]['dayindex'] == day_index){
						const time = response['data'][j]['time_arr'].split(",");
						var result = time.map(function (x) { 
							if(x<9){
								var y = parseInt(x, 10);
								var d = "0"+y;
							}else{
								return parseInt(x, 10);
							}
							return d;
						});
						var incresult = time.map(function (x) { 
							if(x<9){
								var y = parseInt(x, 10)+1;
								var d = "0"+y;
							}else{
								if(parseInt(x, 10)+1 == 25){
									var d = "01";
								}else{
									return parseInt(x, 10)+1;
								}
							}
							return d;
						});
						var flag = 0;
						console.log(result);
						document.getElementById('app_time').innerHTML = "<option value=''>---select---</option>";
						for(var i = 0; i < result.length; i++){
							document.getElementById('app_time').innerHTML += "<option value='"+result[i]+"'>"+ result[i] +":00 ---- "+incresult[i]+":00</option>";
						}
						var currentDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
						document.getElementById('appdate').innerHTML = document.getElementById('bookingstart').value;
					}
				}
				var therapist = document.getElementById('therapistid').options[document.getElementById('therapistid').selectedIndex].text;
				document.getElementById('showtherapist').innerHTML = therapist;
				var service = document.getElementById('serviceId').options[document.getElementById('serviceId').selectedIndex].text;
				service = service.replace(" -------- ", " ");
				service = service.split(" ");
				document.getElementById('showservice').innerHTML = service[0];
				document.getElementById('totalprice').innerHTML = service[1];
				
				
            }
        });
    });
// Update time using date select in appoinment booking start

//Submit Coding Start

function submitform(){
/*------------ SIGNUP Start ------------*/
		
		jQuery.ajax({
			type: "POST",  
			url : server_url + 'api/users/signup',
			dataType: "JSON",
			data: JSON.stringify({
						"name": document.getElementById('txtfirstname').value + " " + document.getElementById('txtlastname').value,
						"email": document.getElementById('txtEmail').value,
						"password": document.getElementById('txtPassword').value,
						"phoneNumber": document.getElementById('txtphone').value,
						"userType": "client"
					}),
			contentType: "application/json",
			success: function(data){
				console.log(data);
				
				window.location.href = "http://localhost/final_project/index.html";
				
			}
		});


/*------------ SIGNUP END ------------*/

//});
}
//Submit Coding End

})