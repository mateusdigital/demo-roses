//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : main.js                                                       //
//  Project   : Roses                                                         //
//  Date      : 22-03-16                                                      //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2022                                                //
//                                                                            //
//  Description :                                                             //
//    http://xahlee.info/SpecialPlaneCurves_dir/Rose_dir/rose.html            //
//
    // https://encyclopediaofmath.org/wiki/Roses_(curves)
    // http://xahlee.info/SpecialPlaneCurves_dir/Rose_dir/rose.html
    // https://en.wikipedia.org/wiki/Rose_%28mathematics%29
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/dat.gui.js",
    "/modules/demolib/modules/external/perlin.js",
    "/modules/demolib/modules/external/Stats.js",

    "/modules/demolib/source/tween.js",
    "/modules/demolib/source/demolib.js",
];

//------------------------------------------------------------------------------
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
            //
            // Create Canvas
            //

            canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);


            //
            // reate Stats
            //

            G.stats = new Stats();
            G.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(G.stats.dom);


            //
            // dat.gui
            //

            G.gui = new dat.GUI();

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

    set_canvas_line_width(1);
    set_canvas_fill("black");

    translate_canvas_to_center();
    clear_canvas();

    //
    // Constants
    //

    C.EASINGS = [
        Tween.Easing.Elastic.InOut,
        Tween.Easing.Back   .InOut,
        Tween.Easing.Bounce .InOut,
    ];

    C.ROSE_DURATION = make_min_max(10, 10);
    C.ROSE_A        = make_min_max(0, 8)
    C.ROSE_S        = make_min_max(0, +5);

    //
    // Globals
    //

    G.shape_size   = calculate_max_shape_size();
    G.thickness    = 1;
    G.num_points   = 1000;

    G.curr_a  = C.ROSE_A.random_int();
    G.next_a  = C.ROSE_A.random_int();
    G.ratio_a = 0;

    G.curr_s  = C.ROSE_S.random_int();
    G.next_s  = C.ROSE_S.random_int();
    G.ratio_s = 0;

    G.curr_color  = get_random_color();
    G.next_color  = get_random_color();
    G.ratio_color = 0;

    G.clear_color  = chroma("black");

    G.anim_time     = 0;
    G.anim_time_max = C.ROSE_DURATION.random_int();

    //
    // Create the gui
    //

    G.gui.add(G, "curr_a",  C.ROSE_A.min, C.ROSE_A.max, 0.01);
    G.gui.add(G, "next_a",  C.ROSE_A.min, C.ROSE_A.max, 0.01);
    G.gui.add(G, "ratio_a", 0, 1, 0.01);

    G.gui.add(G, "curr_s",  C.ROSE_S.min, C.ROSE_S.max, 0.01);
    G.gui.add(G, "next_s",  C.ROSE_S.min, C.ROSE_S.max, 0.01);
    G.gui.add(G, "ratio_s", 0, 1, 0.01);

    G.gui.add(G, "thickness",     1,   10, 1.00);
    G.gui.add(G, "ratio_color",   0,   1,  0.01);
    G.gui.add(G, "num_points",  100, 1000, 1.00);

    start_draw_loop(update_demo);
}


//------------------------------------------------------------------------------
function update_demo(dt)
{
    if(G.stats) {
        G.stats.begin();
    }

    clear_canvas(G.clear_color);

    const a = lerp(G.ratio_a, G.curr_a, G.next_a);
    const s = lerp(G.ratio_s, G.curr_s, G.next_s);
    const c = G.ratio_color;

    draw_rose(a, s, c, G.thickness);

    if(G.stats) {
        G.stats.end();
    }
}


//------------------------------------------------------------------------------
function get_random_color()
{
    const hue = random_int(0, 360);
    return chroma.hsl(hue, 1, 0.5);
}

//------------------------------------------------------------------------------
function calculate_max_shape_size()
{
    const canvas_w   = get_canvas_width ();
    const canvas_h   = get_canvas_height();

    return (Math.min(canvas_w, canvas_h) * 0.8 / 2);
}

//------------------------------------------------------------------------------
function draw_rose(a, s, color_ratio, thickness)
{
    const ctx = get_context();

    begin_draw();
    ctx.beginPath();

    for(let i = 0; i < G.num_points; ++i) {
        const t = i * (MATH_2PI * s / G.num_points);

        const x = (Math.sin(a * t) * Math.cos(t)) * G.shape_size;
        const y = (Math.sin(a * t) * Math.sin(t)) * G.shape_size;

        if(i == 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    const color = chroma.mix(G.curr_color, G.next_color, color_ratio);

    set_canvas_stroke    (color);
    set_canvas_line_width(thickness);

    ctx.stroke();
    end_draw();
}

