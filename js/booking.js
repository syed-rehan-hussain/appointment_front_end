
jQuery(document).ready(function(){
    // Update appoinment start
    
        var server_url = 'http://127.0.0.1:3001/' //Server or domain url
        var token_type = 'Bearer';
        var access_token = localStorage.getItem("access_token");
        
    
    

jQuery.ajax({
    type: "GET",	//get all weekdays hrs
    url : server_url + 'api/users',
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    success: function(data){
       console.log(data);

    //    document.getElementById('therapistid').innerHTML += '<option value="51">Doctor01</option>';
    },
    error: function(xhr, status, error){
        //Handle failure here
        console.log(error);

    }
});


})