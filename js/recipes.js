$(document).ready(function () {
    $(function () {
        /** loading content, earlier written recipes  **/
        if (localStorage.length === 0) {
            $("#empty").css("display", "block");
            $("#noRecipeName").css("display", "none");
        } else {
            $("#empty").css("display", "none");
        }

        var length_ls = localStorage.length;
        for (var i = 1; i <= length_ls; i++) {
            var content_JSON_string = localStorage.getItem(i);
            // if some of the recipes are deleted, then looping through localStorage needs correction 
            // in order for IDs to stay the same on the recepies, with backEnd it wont be a problem, because we have 
            // JSON object
            if (content_JSON_string === null) {
                i++;
                content_JSON_string = localStorage.getItem(i);
            }
            console.log(content_JSON_string);
            var content_JSON_obj = JSON.parse(content_JSON_string);
            console.log(content_JSON_obj.Recipes[0].Name);
            // count ingridiants
            var num_ingrd = content_JSON_obj.Recipes[0].Ingredients.split(",").length;
            var ingrd;
            if (num_ingrd <= 3) {
                ingrd = content_JSON_obj.Recipes[0].Ingredients;
            } else
            {
                ingrd = content_JSON_obj.Recipes[0].Ingredients;
                ingrd = ingrd.split(",");
                ingrd = ingrd.slice(0, 3) + '...';
            }
// count characters in instruction
            var instruction;
            var instruction_ = content_JSON_obj.Recipes[0].Prep_instruction;
            if (content_JSON_obj.Recipes[0].Prep_instruction.length <= 50) {
                instruction = content_JSON_obj.Recipes[0].Prep_instruction;
            } else {
                for (var j = 50; j <= content_JSON_obj.Recipes[0].Prep_instruction.length; j++) {
                    if (instruction_[j] === " " || instruction_[j] === "," || instruction_[j] === ".") {
                        instruction = instruction_.substring(0, j);
                        instruction = instruction + '...';
                        break;
                    } else {
                        instruction = content_JSON_obj.Recipes[0].Prep_instruction;
                    }
                }
            }
// time formating
            var time;
            var h = content_JSON_obj.Recipes[0].Prep_time_hours;
            var m = content_JSON_obj.Recipes[0].Prep_time_minutes;
            m = parseInt(m);
            h = parseInt(h);
            console.log('hours: ' + h + 'and minutes' + m);
            if (isNaN(h)) {
                if (m <= 9) {
                    time = '<p>0' + m + ' minutes';
                } else {
                    time = '<p>' + m + ' minutes';
                }
            } else if (isNaN(m)) {
                if (h <= 9) {
                    time = '<p>0' + h + ' hours';
                } else {
                    time = '<p>' + h + ' hours';
                }
            } else {
                if (m <= 9) {
                    var minutes = '0' + m;
                } else {
                    var minutes = m;
                }
                if (h <= 9) {
                    var hours = '0' + h;
                } else {
                    var hours = h;
                }
                time = '<p>' + hours + ' hours ' + minutes + ' minutes ';
            }
            $("#boxes_content").prepend(
                    '<div class="recipe" id = "' + content_JSON_obj.Recipes[0].Id + '">' +
                    '<div class="image">' +
                    '<img src="img/recipe.png">' +
                    '<div class="name">' +
                    '<h3> ' + content_JSON_obj.Recipes[0].Name + ' </h3>' +
                    '<label><i class="fa fa-clock-o"></i>No.' + content_JSON_obj.Recipes[0].Id + '</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="media form-row">' +
                    '<div class = "form-group col-md-6">' +
                    '<h4> ' + content_JSON_obj.Recipes[0].Source + '</h4>' +
                    '</div>' +
                    '<div class = "form-group col-md-6">' +
                    '<label><i class="fa fa-leaf"></i>No. ingredients: ' + num_ingrd + '</label>' +
                    '<label><i class="fa fa-cutlery"></i>' + ingrd + '</label>' +
                    '</div>' +
                    '<div class = "form-group col-md-12">' +
                    '<p>' +
                    '' + instruction + '' +
                    '</p>' +
                    '</div>' +
                    '<div class = "form-group col-md-12">' +
                    '<label class = "form-row" >Preparation time: &nbsp; ' + time + '</label>' +
                    '</div>' +
                    '<div class = "form-group col-md-12">' +
                    '<button type ="button"  style =" width: 45%" class="btn btn-primary">Delete this Recipe</button>' +
                    '<button type ="button" style =" width: 45%"  class="btn btn-primary">View the Recipe</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                    );
        }
        /** finished loading content  **/
    });
    /** Recipe box **/
    var heart = false;
    $('.lv').click(function () {
        if (!heart) {
            $(this).addClass('fa-heart').removeClass('fa-heart-o');
            heart = true;
        } else {
            $(this).removeClass('fa-heart').addClass('fa-heart-o');
            heart = false;
        }
    });
    // Animate name of the recipe
    $(document).on("mouseover", ".recipe", function () {
        $(this).find(".name").animate({
            height: "70px"
        }, 100);
        $(this).find(".image").animate({
            height: "120px"
        }, 100);
    });
    $(document).on("mouseleave", ".recipe", function () {
        $(this).find(".name").animate({
            height: "35px"
        }, 100);
        $(this).find(".image").animate({
            height: "200px"
        }, 100);
    });
    /**Return to Top**/
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200); // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200); // Else fade out the arrow
        }
    });
    $('#return-to-top').click(function () {      // When arrow is clicked
        $('body,html').animate({
            scrollTop: 0                       // Scroll to top of body
        }, 500);
    });
    /** Hide #content and show selected recipe**/
    $(document).on("click", "#boxes_content button:contains(View)", function () {
        $("#searchBar").hide();
        $("#Goback_recipe_1").show();
// get the JSON string from localStorage, and convert it to JSON object
        var content_JSON_string = localStorage.getItem($(this).parents("#boxes_content .recipe").attr('id'));
        console.log(content_JSON_string);
        var content_JSON_obj = JSON.parse(content_JSON_string);
        console.log(content_JSON_obj.Recipes[0].Name);
// separation of Ingredients elements and storing them into an arrays
        var Ingredients = [];
        Ingredients = content_JSON_obj.Recipes[0].Ingredients;
        Ingredients = Ingredients.split(",");
        var Ingredients_q = [];
        Ingredients_q = content_JSON_obj.Recipes[0].Ingredients_quantities;
        Ingredients_q = Ingredients_q.split(",");
        var ingrd_content = [];
        for (var i = 0; i < Ingredients.length; i++) {
            ingrd_content[i] = '<li><i class="icon-chevron-right"></i>&nbsp' + Ingredients[i] + ' - ' + Ingredients_q[i] + '</li>';
        }
// time formating
        var time;
        var h = content_JSON_obj.Recipes[0].Prep_time_hours;
        var m = content_JSON_obj.Recipes[0].Prep_time_minutes;
        m = parseInt(m);
        h = parseInt(h);
        console.log('hours: ' + h + 'and minutes' + m);
        if (isNaN(h)) {
            if (m <= 9) {
                time = '<p>0' + m + ' minutes';
            } else {
                time = '<p>' + m + ' minutes';
            }
        } else if (isNaN(m)) {
            if (h <= 9) {
                time = '<p>0' + h + ' hours';
            } else {
                time = '<p>' + h + ' hours';
            }
        } else {
            if (m <= 9) {
                var minutes = '0' + m;
            } else {
                var minutes = m;
            }
            if (h <= 9) {
                var hours = '0' + h;
            } else {
                var hours = h;
            }
            time = '<p>' + hours + ' hours ' + minutes + ' minutes ';
        }

        /** Find what ingridiants are used **/
        var ing = []; // next 5 lines we will take the names of all ingridiants that are used
        var ing_q = []; // array for the quantities
        var j = 0;
        var x = 2;
        $("#boxes_content").fadeOut(500, function () {
            $("#recipe_details").fadeIn(500, function () {
                $("#Goback_recipe_1").fadeIn(500, function () {});
                $("#recipe_content").html(
                        '<article  class="blog-post"  id = "' + content_JSON_obj.Recipes[0].Id + '" >' +
                        '<div>' +
                        '<img src = "img/recipe.png"/>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div id="left_hand">' +
                        '<h4>' + content_JSON_obj.Recipes[0].Name + '</h4>' +
                        '<h4>' + content_JSON_obj.Recipes[0].Source + '</h4>' +
                        '<h4 class = "h4_mod">Ingredients:</h4>' +
                        '<ul id = "ingrd_list">' +
                        '' + ingrd_content.join("") + '' +
                        '</ul>' +
                        '<h4 class = "h4_mod">Preparation time:</h4><label> ' + time + '</label>' +
                        '</div>' +
                        '<div id="right_hand">' +
                        '<div>' +
                        '<h4 class = "h4_mod">Preparation instructions:</h4>' +
                        '<p>' + content_JSON_obj.Recipes[0].Prep_instruction + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<button id="deleteRecipe" class="btn btn-primary">Delete recipe</button>' +
                        '</article>'
                        );
            });
        });
    });
    /** Go back to recipes 1 **/
    $("#Goback_recipe_1").click(function () {
        $("#recipe_details").fadeOut(500, function () {
            $("#boxes_content").fadeIn(500, function () {
                $("#recipe_content").empty();
            });
            $("#searchBar").show();
            $("#Goback_recipe_1").hide();
            if (localStorage.length === 0) {
                $(".text-block").css("display", "block");
            } else {
                $(".text-block").css("display", "none");
            }
        });
        $("#Goback_recipe_1").fadeOut(500, function () {});
        $("#noRecipeName").css("display", "none", "important");
    });
    /** Go back to recipes 2 **/
    $("#Goback_recipe_2").click(function () {
        
        $("#add_new_recipe").fadeOut(500, function () {
            $("#boxes_content").fadeIn(500, function () {
                $("#recipe_content").empty();
            });
            $("#searchBar").show();
            $("#Goback_recipe_2").hide();
            if (localStorage.length === 0) {
                $(".text-block").css("display", "block");
            } else {
                $(".text-block").css("display", "none");
            }
            $("#content").fadeIn(500, function () {});
        });
        $("#Goback_recipe_1").fadeOut(500, function () {});
        
        $("#noRecipeName").css("display", "none", "important");
    });
    /** Add new recipe **/
    $("#addNewRecipe").click(function () {
        $(".text-block").css("display", "none");
        $("#Goback_recipe_1").fadeOut(300, function () {});
        // $(".navbar").fadeOut(500, function () {});
        $("#searchBar").hide();
        $("#Goback_recipe_2").show();
        $("#boxes_content").fadeOut(300, function () {});
        $("#content").fadeOut(300, function () {});
        $("#recipe_details").fadeOut(300, function () {});
        $("#add_new_recipe").fadeIn(500, function () {});
        /** After every click on the button reset all fields **/
        restFileds();
    });
    /** Change image thumbnail **/
    $("#RecipeImg_input").change(function (e) {
        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
            var file = e.originalEvent.srcElement.files[i];
            var img = document.getElementById("RecipeImg");
            var reader = new FileReader();
            reader.onloadend = function () {
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });
    /** after choosing ingridiants, display it as chosen **/
    $(document).on('click', '#choose_ingrd button', function () {
        var name = $(this).text();
        $(this).remove();
        $("#chosen_ingrd").append(
                '<button type ="button" class="btn btn-success">' + name + '</button>' +
                '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                );
    });
    /** removing clicked ingridiants from chosen section  **/
    $(document).on('click', '#chosen_ingrd button', function () {
        var name = $(this).text();
        $(this).next().remove();
        $(this).nextAll().eq(0).remove();
        $(this).remove();
        if (name === 'Milk' | name === 'Oil' | name === 'Flour' | name === 'Salt' | name === 'Sugar' | name === 'Eggs'
                | name === 'Tomatoes' | name === 'Peppers' | name === 'Cheese' | name === 'Potatoes' | name === 'Meat') {
            $("#choose_ingrd").append(
                    '<button type ="button"  class="btn btn-primary">' + name + '</button>'
                    );
        }
    });
    $(document).on('mouseover', '#chosen_ingrd button', function () {
        $(this).nextAll().eq(1).css("display", "block");
    });
    $(document).on('mouseleave', '#chosen_ingrd button', function () {
        $(this).nextAll().eq(1).css("display", "none");
    });
    $("#other_ingrd").on("change", function () {
        if ($(this).val() !== "") {  // if there is an input continue
            var name = $(this).val().toLowerCase(); // next three lines are making the format of the input string as Yyyy
            var x = name[0].toUpperCase();
            name = name.replace(name[0], x);
            switch (name) {
                case 'Milk':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Salt':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Flour':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Oil':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Sugar':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Eggs':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Tomatoes':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Peppers':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Cheese':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Meat':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button"  class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                case 'Potatoes':
                    $("#choose_ingrd button:contains(" + name + ")").remove();
                    $("#chosen_ingrd").append(
                            '<button type ="button" class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
                default:
                    $("#chosen_ingrd").append(
                            '<button type ="button" id = "' + name + '" class="btn btn-success">' + name + '</button>' +
                            '<input type = "text" placeholder = "Enter..." class="form-control input_short" />' +
                            '<span aria-hidden="true" style = "display:none; margin-right: 1%;">&times;</span>'
                            );
                    break;
            }
            $("#other_ingrd").val("");
        }
    });
    /** Saving recipes **/
    $(document).on("click", "#saveRecipe", function () {
        var all_correct = 0;
        var empty_ingrd = 0;
        $("#content").fadeIn(500, function () {});
        // checking if everything we need is filled
        if (all_correct !== 6) {
            window.scrollTo(0, 0);
            // restriction about the fields in the form
            if ($("#inputName").val() === "") {
                $("form label:contains(Name:)").html("Name: <div style = 'color:red;'>&nbsp;Name of the recipe is required *</div>").addClass("form-row");
                all_correct = all_correct - 1;
            } else {
                all_correct = all_correct + 1;
            }
            if ($("#inputSource").val() === "") {
                $("form label:contains(Source:)").html("Source: <div style = 'color:red;'>&nbsp;Source of the recipe is required *</div>").addClass("form-row");
                all_correct = all_correct - 1;
            } else {
                all_correct = all_correct + 1;
            }
            if (($("#prep_time_h").val() === "") && ($("#prep_time_m").val() === "")) {
                $("form label:contains(Preparation time:)").html("Preparation time: <div style = 'color:red;'>&nbsp;Preparation time is required *</div>").addClass("form-row");
                all_correct = all_correct - 1;
            } else {
                all_correct = all_correct + 1;
            }
            if ($("#pred_inst").val() === "") {
                $("form label:contains(Preparation instruction:)").html("Preparation instruction: <div style = 'color:red;'>&nbsp;Preparation instructions are required *</div>").addClass("form-row");
                all_correct = all_correct - 1;
            } else {
                all_correct = all_correct + 1;
            }
            if ($("#chosen_ingrd").html() === "") {
                $("form label:contains(Choose ingredients:)").html("Choose ingredients: <div style = 'color:red;'>&nbsp;Recipe requires at least one ingridiant *</div>").addClass("form-row");
                all_correct = all_correct - 1;
            } else {
                all_correct = all_correct + 1;
            }
            $('#chosen_ingrd input').each(function (i) {
                if ($(this).val() === "") {
                    empty_ingrd++;
                }
            });
            if (empty_ingrd >= 1) {
                $("form label:contains(Chosen ingredients:)").html("Chosen ingredients: <div style = 'color:red;'>&nbsp;All ingridiants must have quantities *</div>").addClass("form-row");
                all_correct = all_correct - 1;
            } else {
                all_correct = all_correct + 1;
            }
        }
        if (all_correct === 6) {
            var LS_count = localStorage.length;
            LS_count = parseInt(LS_count);
            var id = LS_count + 1;
            /** Find what ingridiants are used **/
            var ing = []; // next 5 lines we will take the names of all ingridiants that are used
            var ing_q = []; // quantities of ingridiants
            var j = 0;
            var x = 2;
            for (var i = 1; i <= $("#chosen_ingrd button").length * 3; i = i + 3) {
                ing[j] = ("" + $("#chosen_ingrd button:nth-child(" + i + ")").text() + "");
                ing_q[j] = ("" + $("#chosen_ingrd input:nth-child(" + x + ")").val() + "");
                j++;
                x = x + 3;
            }
            // first letter UpperCase
            var name = $("#inputName").val();
            name = name.charAt(0).toUpperCase() + name.slice(1);
            var pred_instructions = $("#pred_inst").val().replace(/\r\n|\n|\r/gm, '\\n');
            var content = '{"Recipes":[' +
                    '{"Name":"' + name + '",' +
                    ' "Source":"' + $("#inputSource").val() + '",' +
                    ' "Prep_time_hours":"' + $("#prep_time_h").val() + '",' +
                    ' "Prep_time_minutes":"' + $("#prep_time_m").val() + '",' +
                    ' "Prep_instruction":"' + pred_instructions + '",' +
                    ' "Ingredients":"' + ing + '",' +
                    ' "Ingredients_quantities":"' + ing_q + '",' +
                    ' "Id":"' + id + '",' +
                    ' "Image":"" ' + // we have a option for image Upload, and store it into JSON then upload it to server 
                    //for each recipe, by Default we have same image for all recipes
                    '}]}';
            localStorage.setItem(LS_count + 1, content);
            /** rest all the fields **/
            restFileds();
            /** load all recipes  **/
            $("#empty").css("display", "none");
            var length_ls = localStorage.length;
            var content_JSON_string = localStorage.getItem(length_ls);
            console.log(content_JSON_string);
            var content_JSON_obj = JSON.parse(content_JSON_string);
            console.log(content_JSON_obj.Recipes[0].Name);
            // count ingridiants
            var num_ingrd = content_JSON_obj.Recipes[0].Ingredients.split(",").length;
            var ingrd;
            if (num_ingrd <= 3) {
                ingrd = content_JSON_obj.Recipes[0].Ingredients;
            } else
            {
                ingrd = content_JSON_obj.Recipes[0].Ingredients;
                ingrd = ingrd.split(",");
                ingrd = ingrd.slice(0, 3) + '...';
            }
// count characters in instruction
            var instruction;
            var instruction_ = content_JSON_obj.Recipes[0].Prep_instruction;
            if (content_JSON_obj.Recipes[0].Prep_instruction.length <= 50) {
                instruction = content_JSON_obj.Recipes[0].Prep_instruction;
            } else {
                for (var j = 50; j <= content_JSON_obj.Recipes[0].Prep_instruction.length; j++) {
                    if (instruction_[j] === " " || instruction_[j] === " ") {
                        instruction = instruction_.substring(0, j);
                        instruction = instruction + '...';
                        break;
                    } else {
                        instruction = content_JSON_obj.Recipes[0].Prep_instruction;
                    }
                }
            }
// time formating
            var time;
            var h = content_JSON_obj.Recipes[0].Prep_time_hours;
            var m = content_JSON_obj.Recipes[0].Prep_time_minutes;
            m = parseInt(m);
            h = parseInt(h);
            console.log('hours: ' + h + 'and minutes' + m);
            if (isNaN(h)) {
                if (m <= 9) {
                    time = '<p>0' + m + ' minutes';
                } else {
                    time = '<p>' + m + ' minutes';
                }
            } else if (isNaN(m)) {
                if (h <= 9) {
                    time = '<p>0' + h + ' hours';
                } else {
                    time = '<p>' + h + ' hours';
                }
            } else {
                if (m <= 9) {
                    var minutes = '0' + m;
                } else {
                    var minutes = m;
                }
                if (h <= 9) {
                    var hours = '0' + h;
                } else {
                    var hours = h;
                }
                time = '<p>' + hours + ' hours ' + minutes + ' minutes ';
            }
            $("#boxes_content").prepend(
                    '<div class="recipe" id = "' + content_JSON_obj.Recipes[0].Id + '">' +
                    '<div class="image">' +
                    '<img src="img/recipe.png">' +
                    '<div class="name">' +
                    '<h3> ' + content_JSON_obj.Recipes[0].Name + ' </h3>' +
                    '<label><i class="fa fa-clock-o"></i>No.' + content_JSON_obj.Recipes[0].Id + '</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="media form-row">' +
                    '<div class = "form-group col-md-6">' +
                    '<h4> ' + content_JSON_obj.Recipes[0].Source + '</h4>' +
                    '</div>' +
                    '<div class = "form-group col-md-6">' +
                    '<label><i class="fa fa-leaf"></i>No. ingredients: ' + num_ingrd + '</label>' +
                    '<label><i class="fa fa-cutlery"></i>' + ingrd + '</label>' +
                    '</div>' +
                    '<div class = "form-group col-md-12">' +
                    '<p>' +
                    '' + instruction + '' +
                    '</p>' +
                    '</div>' +
                    '<div class = "form-group col-md-12">' +
                    '<label class = "form-row" >Preparation time: &nbsp; ' + time + '</label>' +
                    '</div>' +
                    '<div class = "form-group col-md-12">' +
                    '<button type ="button"  style =" width: 45%"  class="btn btn-primary">Delete this Recipe</button>' +
                    '<button type ="button" style =" width: 45%"  class="btn btn-primary">View the Recipe</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                    );
            // if everything passes open modal for successfully saved recipe
            $('#modal_saved').modal('show');
            all_correct = 0;
            // after successfully saved, go to list of recepis
            $("#Goback_recipe_2").trigger("click");
        }
    });
    /** Test, clears all localStorage **/
    $("#test").click(function () {
        localStorage.clear();
    });

    /** onChange remove (red) errors from the from **/
    $(document).on("change", "#inputName", function () {
        $("form label:contains(Name:)").find("div").remove();
    });
    $(document).on("change", "#inputSource", function () {
        $("form label:contains(Source:)").find("div").remove();
    });
    $(document).on("change", "#prep_time_h, #prep_time_m", function () {
        $("form label:contains(Preparation time:)").find("div").remove();
    });
    $(document).on("DOMSubtreeModified", "#chosen_ingrd", function () {
        $("form label:contains(Choose ingredients:)").find("div").remove();
        $("form label:contains(Choose ingredients:)").removeClass("form-row");
    });
    $(document).on("change", "#pred_inst", function () {
        $("form label:contains(Preparation instruction:)").find("div").remove();
    });
    $(document).on("change", "#chosen_ingrd input", function () {
        var emptyIngrd = 0;
        $('#chosen_ingrd input').each(function (i) {
            if ($(this).val() === "") {
                emptyIngrd++;
            }
        });
        if (emptyIngrd === 0) {
            $("form label:contains(Chosen ingredients:)").find("div").remove();
            $("form label:contains(Chosen ingredients:)").removeClass("form-row");
            emptyIngrd = 0;
        }
    });
    /** Search Bar **/
    $(document).on("keyup", "#searchBar", function () {
        var value = $(this).val().toLowerCase();
        var shown = 0;
        $("#boxes_content .name h3").filter(function () {
            $(this).closest("#boxes_content .recipe").toggle($(this).text().toLowerCase().indexOf(value) > -1);
            if ($(this).text().toLowerCase().indexOf(value) > -1) {
                shown++;
            }
        });
        /** hide and show text if there is no match in the search **/
        if (shown >= 1) {
            $("#noRecipeName").css("display", "none", "important");
        } else {
            $("#noRecipeName").css("display", "block", );
        }
        /** background text, id = "empty"  id = "noRecipeName", toggle  **/
        if ($("#noRecipeName").is(":visible")) {
            $("#empty").css("display", "none");
        }
        if (!$(this).val()) {
            $("#noRecipeName").css("display", "none");
            if ($("#boxes_content").html() === "") {
                $("#empty").css("display", "block");
            }
        }
    });
    /** Function that resets the form fields **/
    function restFileds() {
        $("#inputName").val("");
        $("#inputSource").val("");
        $("#prep_time_h").val("");
        $("#prep_time_m").val("");
        $("#pred_inst").val("");
        $("#chosen_ingrd").html("");
        $("#choose_ingrd").html(
                '<button type ="button" class="btn btn-primary">Flour</button>' +
                '<button type ="button"  class="btn btn-primary">Milk</button>' +
                '<button type ="button"  class="btn btn-primary">Oil</button>' +
                '<button type ="button"  class="btn btn-primary">Salt</button>' +
                '<button type ="button"  class="btn btn-primary">Sugar</button>' +
                '<button type ="button"  class="btn btn-primary">Eggs</button>' +
                '<button type ="button"  class="btn btn-primary">Tomatoes</button>' +
                '<button type ="button" class="btn btn-primary">Peppers</button>' +
                '<button type ="button"  class="btn btn-primary">Cheese</button>' +
                '<button type ="button"  class="btn btn-primary">Potatoes</button>' +
                '<button type ="button"  class="btn btn-primary">Meat</button><br>'
                );
    }

    /** Delete Recipe  **/


    /** On click delete button in the list of recipes **/
    $(document).on("click", "#boxes_content button:contains(Delete)", function () {
        $('#modal_delete_recipe').modal('show');
        var id = $(this).closest("#boxes_content .recipe").attr("id");
        $("#Confirm_delete").on("click", function () {
            $("#" + id + "").hide();
            $("#" + id + "").remove();
            localStorage.removeItem(id);
            /** show text **/
            $("#empty").css("display", "block");
        });
    });
    /** On click delete button  inside the recipe **/
    $(document).on("click", "#deleteRecipe", function () {
        $('#modal_delete_recipe').modal('show');
        var id = $(this).closest("#recipe_content .blog-post").attr("id");
        $("#Confirm_delete").on("click", function () {
            localStorage.removeItem(id);
            $("#recipe_details").fadeOut(200, function () {
                location.reload();
            })();
        });
    });

    /** max minutes 60 **/
    $(document).on("change", "#prep_time_m", function () {
        if ($(this).val() > 60) {
            $(this).val(60);
        }
    });


});
