jQuery(document).ready(function() {
    jQuery(".main .div").hide(); 
    // Cache tout les textes et les sous-menu
  
    jQuery(".slidebar li:first").attr("id","active"); 
    // Ajoute la class active au premier menu
   
    jQuery(".main div:first").fadeIn(); 
    // Montre le premier texte à l'apparition de la page
    
  
    jQuery('.slidebar a').click(function(e) {
        e.preventDefault();
       if (jQuery(this).closest("li").attr("id") == "active"){ 
            //si le menu cliquer est déjà ouvert.
         return       
       }else{             
         jQuery(".main .div").hide(); 
            // Cache tous les éléments
  
          jQuery(".slidebar li").attr("id","");  
            // Rénitialise tout les menu active
     
          jQuery(this).parent().attr("id","active"); 
            // active le parent du li selectionner
               
          jQuery('#' + jQuery(this).attr('name')).fadeIn(); 
            // Montre le texte
          }
       
    });
  
  });