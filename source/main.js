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
    // demolib
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/dat.gui.js",
    "/modules/demolib/modules/external/perlin.js",
    "/modules/demolib/modules/external/Stats.js",

    "/modules/demolib/source/demolib.js",

    // Sidebar
    "/modules/sidebar/data/css/sidebar.css",
    "/modules/sidebar/source/sidebar.js"
];

__DEMO_NAME = "roses";

//------------------------------------------------------------------------------
const C = {}; // Constants
const G = {}; // Globals


//----------------------------------------------------------------------------//
// demolib boilerplate                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_demo_mode() {
    return new Promise((resolve, reject) => {
        demolib_load_all_scripts(__SOURCES).then(() => {

            //
            // Create Canvas
            //

            G.canvas_container = document.getElementById("canvas_container");
            G.canvas_container.classList.add("sidebar_push");

            G.canvas = document.createElement("canvas");
            G.canvas.width  = window.innerWidth;
            G.canvas.height = window.innerHeight;

            G.canvas.style.position = "fixed";
            G.canvas.style.left     = "0px";
            G.canvas.style.top      = "0px";
            G.canvas.style.zIndex   = "-100";

            G.canvas_container.appendChild(G.canvas);

            //
            // Create Stats / dat.gui
            //

            G.stats = new Stats();
            G.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(G.stats.dom);

            G.gui = new dat.GUI();


            //
            // Create Sidebar
            //

            G.sidebar = Sidebar.create();

            const roses = G.sidebar.add_section("Roses");
            roses.add_button("Restart", Sidebar.Icons.Restart()).on_click(()=>{
                demo_restart();
            });

            const main = G.sidebar.add_section("");
            main.add_toggle("Developer Mode", Sidebar.Icons.Dev()).on_value_changed((element, toggled)=>{
                if(toggled) {
                    element.img.src = Sidebar.Icons.IDDQD();
                    set_style_visible(G.stats.dom, G.gui.domElement);
                } else {
                    element.img.src = Sidebar.Icons.Dev();
                    set_style_hidden(G.stats.dom, G.gui.domElement);
                }
            });

            const more = G.sidebar.add_section("More");
            more.add_button("About", Sidebar.Icons.About()).on_click(()=>{
                var url = str_cat("https://stdmatt.com/demos/", __DEMO_NAME, ".html");
                window.open(url, '_blank');
            });
            more.add_button("More",  Sidebar.Icons.More ()).on_click(()=>{
                var url = "https://stdmatt.com/demos.html";
                window.open(url, '_blank');
            });

            document.body.appendChild(G.sidebar.dom);

            //
            // Hamburger
            //

            const hamburger = G.sidebar.create_hamburger(
                "\u2630 menu",
                "\u2716 close",
                ()=> {
                    const size = (G.sidebar.is_open) ? "300px" : "0px";
                    G.sidebar.dom.style.width           = size;
                    G.canvas_container.style.marginLeft = size;
                }
            );

            G.canvas_container.appendChild(hamburger);

            //
            // Finish
            //

            set_style_hidden(G.stats.dom, G.gui.domElement);
            resolve(G.canvas);
        });
    });
}

//------------------------------------------------------------------------------
function demo_start(user_canvas) {
    if (!user_canvas) {
        setup_demo_mode().then((_created_canvas) => {
            setup_common(_created_canvas);
        });
    } else {
        setup_common(user_canvas);
    }
}



//----------------------------------------------------------------------------//
// Demo ;)                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_random_seed(null);
    set_noise_seed (null);

    set_main_canvas(canvas);
    install_input_handlers(canvas);

    set_canvas_line_width(1);
    set_canvas_fill("black");

    translate_canvas_to_center();
    clear_canvas();

    //
    // Constants
    //

    C.ALL_EASINGS = get_all_easings();

    C.EASINGS = [
        easing_exponential_in_out,
        easing_circular_in_out,
        easing_elastic_in_out
    ];

    C.ROSE_DURATION = make_min_max( 10,  25);
    C.ROSE_A        = make_min_max(  0,   8);
    C.ROSE_S        = make_min_max(-10, +10);

    C.COLOR_STOPS = make_min_max(3, 6);

    //
    // Globals
    //
    G.canvas = canvas;

    G.shape_size = calculate_max_shape_size();
    G.thickness  = 1;
    G.num_points = 1000;

    G.curr_a  = 0;
    G.next_a  = 0;
    G.ratio_a = 0;

    G.curr_s  = 0;
    G.next_s  = 0;
    G.ratio_s = 0;

    G.gradient    = get_random_gradient();
    G.clear_color = chroma("black");

    G.auto_anim     = true;
    G.anim_time     = Infinity; // @notice: Needs to trigger reset at 1st frame.
    G.anim_time_max = C.ROSE_DURATION.random_int();

    G.easing          = get_random_easing();
    G.selected_easing = null;

    reset_rose(true);

    //
    // Create the gui
    //

    G.gui.add(G, "curr_a", C.ROSE_A.min, C.ROSE_A.max, 0.01).listen();
    G.gui.add(G, "next_a", C.ROSE_A.min, C.ROSE_A.max, 0.01).listen();
    G.gui.add(G, "ratio_a", 0, 1, 0.01).listen();

    G.gui.add(G, "curr_s", C.ROSE_S.min, C.ROSE_S.max, 0.01).listen();
    G.gui.add(G, "next_s", C.ROSE_S.min, C.ROSE_S.max, 0.01).listen();
    G.gui.add(G, "ratio_s", 0, 1, 0.01).listen();

    G.gui.add(G, "thickness", 1, 10, 1.00);
    G.gui.add(G, "num_points", 100, 1000, 1.00);

    G.gui.add(G, "anim_time", 0, G.anim_time_max, 0.01).listen();
    G.gui.add(G, "anim_time_max", 1, 10, 1.00).listen();
    G.gui.add(G, "auto_anim");

    G.gui.add(G, "selected_easing", ["NOT_USED", ...C.ALL_EASINGS]).onChange((v) => {
        if (v == "NOT_USED") {
            G.easing = get_random_easing();
            return;
        }

        for (let i = 0; i < C.ALL_EASINGS.length; ++i) {
            if (C.ALL_EASINGS[i].toString() == v) {
                G.easing = C.ALL_EASINGS[i];
                return;
            }
        }
    });

    start_draw_loop(update_demo);
}

//------------------------------------------------------------------------------
function update_demo(dt)
{
    if (G.stats) {
        G.stats.begin();
    }

    //
    // Update
    //

    if (G.auto_anim) {
        G.anim_time += dt;
        if (G.anim_time > G.anim_time_max) {
            reset_rose();
        }
    }

    G.ratio_a = (G.anim_time / G.anim_time_max);
    G.ratio_s = (G.anim_time / G.anim_time_max);

    const a = lerp(G.easing(G.ratio_a), G.curr_a, G.next_a);
    const s = lerp(G.easing(G.ratio_s), G.curr_s, G.next_s);

    //
    // Draw
    //

    begin_draw();
    const alpha = 0.4
    clear_canvas(G.clear_color.alpha(alpha));

    const ctx = get_context();

    ctx.beginPath();
    ctx.strokeStyle = G.gradient;
    ctx.lineWidth = 4;

    for (let i = 0; i <= G.num_points; ++i) {
        const t = i * (MATH_2PI * s / G.num_points);

        const x = (Math.sin(a * t) * Math.cos(t)) * G.shape_size;
        const y = (Math.sin(a * t) * Math.sin(t)) * G.shape_size;

        if (i == 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
    end_draw();

    if (G.stats) {
        G.stats.end();
    }
}

//------------------------------------------------------------------------------
function get_random_gradient()
{
    const r0 = G.shape_size * random_float(0.05, 0.2);
    const r1 = G.shape_size * random_float(1.1, 1.3);
    const cs = C.COLOR_STOPS.random_int();

    const c1 = chroma.hsl(random_int(360), 0.8, 0.5);
    const c2 = chroma.hsl(random_int(360), 0.8, 0.5);
    const template_colors = [c1, c2];

    const colors = chroma
        .scale(template_colors)
        .mode('lch')
        .colors(cs);

    const grd = get_context().createRadialGradient(0, 0, r0, 0, 0, r1);
    for (let i = 0; i < cs; ++i) {
        const c = colors[i];
        const t = ((i + 1) / cs);

        grd.addColorStop(t, c);
    }

    return grd;
}

//------------------------------------------------------------------------------
function get_random_easing() {
    random_element(C.EASINGS);
}

//------------------------------------------------------------------------------
function calculate_max_shape_size() {
    const canvas_w = get_canvas_width();
    const canvas_h = get_canvas_height();

    return (Math.min(canvas_w, canvas_h) * 0.8 / 2);
}

//------------------------------------------------------------------------------
function reset_rose(first_time)
{
    G.anim_time       = 0;
    G.anim_time_total = C.ROSE_DURATION.random_int();

    if (first_time) {
        G.next_a = C.ROSE_A.random_float();
        G.next_s = C.ROSE_S.random_float();
    }

    G.curr_a = G.next_a;
    G.curr_s = G.next_s;
    G.easing = get_random_easing();

    // Get a random float biased to the minus
    // so the 'a' keeps going closer to 0
    // which brings interesting curves.
    //
    // Doing this way to have more control
    // in how the thing walks in the number line...
    while (true) {
        const v = random_float(-2, +1);
        const n = (G.curr_a + v);

        if (C.ROSE_A.in_range(n)) {
            G.next_a = n;
            break;
        }
    }

    // From [0,1] curve assumes very interesting look & feel..
    // But they need a very big value of 's' to make the visible
    // otherwise the just show as a boring opened loop
    //
    // The G.next_s going to value->0->value is to make an
    // yoyo animation with the 's' value.
    if (G.next_a < 1) {
        if (G.curr_s == 0) {
            G.next_s   = random_signed(C.ROSE_S.max);
            G.gradient = get_random_gradient();
        } else {
            G.next_s = 0;
        }
    }
    // Normal rose...
    else {
        if (G.curr_s == 0) {
            G.next_s   = C.ROSE_S.random_int_without(G.curr_s);
            G.gradient = get_random_gradient();
        } else {
            G.next_s = 0;
        }
    }
}
