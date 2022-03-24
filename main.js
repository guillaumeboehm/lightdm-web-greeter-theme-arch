var input = document.getElementById("input");
input.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        authenticate(e.target.value);
    }
});

window.authentication_done = () => {
    if (lightdm.is_authenticated) {
        console.log("Authenticated!");
        $( 'body' ).fadeOut( 1000, () => {
            lightdm.start_session(lightdm.default_session);
        } );
    } else {
        getImg();
        input.value = "";
        input.placeholder = "user";
        input.type = "text";
        input.disabled = false;
        input.focus();
        input.select();
    }
};

function pad(a, b) {
    return (1e15 + a + "").slice(-b);
}

async function getImg() {
    // let _paths = ['/usr/share/web-greeter/themes/arch/wallpapers','/usr/share/backgrounds/lightdm'];
    let _paths = ['/usr/share/backgrounds/lightdm'];

    function pullImages(paths, images){
	    let path = paths.pop();
	    theme_utils.dirlist(path, true, (data)=>{
		    let new_images = images.concat(data);
		    if(paths.length > 0)
			    pullImages(paths, new_images);
		    else{
			    let index = Math.floor(Math.random() * data.length);
			    document.getElementsByTagName('body')[0].style.backgroundImage =
				"url("+ data[index] +")";
		    }
	    })
    }
    pullImages(_paths, []);
}

window.addEventListener("GreeterReady", () => {
    lightdm.authentication_complete?.connect(() => window.authentication_done());
    getImg();
    input.focus();
    input.select();
    input.value = lightdm.select_user_hint;
    if(input.value) {
      authenticate(input.value);
    }
});

function authenticate(input_text) {
    if(!lightdm.in_authentication || !lightdm.authentication_user) {
        lightdm.authenticate(input_text);
        input.value = "";
        input.type = "password";
        input.placeholder = "password";
        input.disabled = false;
    } else {
        input.disabled = true;
        lightdm.respond(input_text);
    }
}
