//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : main.js                                                       //
//  Project   : //
//  Date      : //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2022                                                  // 
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/dat.gui.js",
    "/modules/demolib/modules/external/perlin.js",
    "/modules/demolib/source/demolib.js",
]

const C = {}; // Constants
const G = {}; // Globals


//----------------------------------------------------------------------------//
// demolib boilerplate                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_demo_mode()
{
    return new Promise((resolve, reject)=> {
        demolib_load_all_scripts(__SOURCES).then(()=> {
            canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);
            resolve(canvas);
        });
    });
}

//------------------------------------------------------------------------------
function demo_start(user_canvas)
{
    if(!user_canvas) {
        setup_demo_mode().then((_created_canvas)=>{
            setup_common(_created_canvas);
        });
    } else {
        setup_common(user_canvas);
    }
}


//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_random_seed(null);
    set_noise_seed (null);

    set_main_canvas       (canvas);
    install_input_handlers(canvas);

    G.n = 1;
    G.d = 1;
    
    G.curr_t  = 0;
    G.total_t = 0;

    translate_canvas_to_center();

    set_canvas_fill("black");
    clear_canvas();

    start_draw_loop(update_demo);
}

//------------------------------------------------------------------------------
function update_demo(dt)
{
    const canvas_w   = get_canvas_width ();
    const canvas_h   = get_canvas_height(); 
    const shape_size = Math.min(canvas_w, canvas_h) / 2;

    begin_draw();

    G.curr_t += dt;
    if(G.curr_t >= G.total_t) { 
        G.curr_t  = 0;
        G.total_t = random_int(4, 10);
        
        G.n = (G.n + 1) % 10;
        G.d = 2;
        G.k = (G.n / G.d);
        
        G.x = null;
        G.y = null;

        G.total_angle = (MATH_2PI * G.d);
        if(G.k == Math.trunc(G.k)) { 
            G.total_angle = MATH_2PI * (G.d / 2);
        }

        set_canvas_fill("black");
        clear_canvas();
   
        console.log(G);
    }

    const t = (G.curr_t / G.total_t);
    
    const theta = lerp(t, 0, G.total_angle);
    const x     = shape_size * Math.cos(G.k * theta) * Math.cos(theta);
    const y     = shape_size * Math.cos(G.k * theta) * Math.sin(theta);
    
    const c = chroma.hsl(t * 360, 0.5, 0.5);
    set_canvas_stroke(c);
    set_canvas_line_width(1);
    if(G.x == null) { 
        G.x = x;
        G.y = y;
    } else { 
        draw_line(G.x, G.y, x, y); 
        G.x = x;
        G.y = y;
    }
}
