![Soil](/img/soil-screenshot.png)

# Soil

A simple startpage for your homelab, displaying:

- Dynamic system info and stats
- Bookmarks and links
- Any other Markdown content you want

Soil is no-frills by design, because I wanted something that was stylistically more neofetch than Homepage/Heimdall.

## soil.config.yaml

Everything on the screen is configurable through [soil.config.yaml](./soil.config.yaml). This includes all of the content (which can be different depending on desktop/mobile) and the light/dark color schemes.

You can see the provided config for examples of how everything works, but here's a more detailed and formal description of the config schema. `?` indicates an optional key.

- **SoilConfig**
  - `content`: **Content**  
    Desktop page content.
  - `content-mobile?`: **Content**  
    Mobile page content. Defaults to using the same content as the desktop page.
  - `theme?`:  
    Theme customization.
    - `light?`: **Theme**  
      Colors for the light theme. Defaults to black text on a white background, with no additional named colors.
    - `dark?`: **Theme**  
      Colors for the dark theme. Defaults to white text on a black background, with no additional named colors.

- **Content**
  - `main`: [**Block** | **Row** | **Widget**]  
    The main block of content, a list of content elements.
  - `footer?`: [**Block** | **Row** | **Widget**]  
    An optional footer block of content, fixed to the bottom of the page.

- **Block**
  - `block`: _string_  
    A full block of Markdown text. You can use any feature that comes with Markdown, including `# Headers`, `- lists`, and `_inline_ **formatting**`. Additionally, you can insert JavaScript in `{{ double curly braces }}` - see [computed content](#computed-content).

- **Row**
  - `row`: [**Cell**]  
    A list of cells, which can contain text and data bars.

- **Cell**
  - `text?`: _string_  
    A line of Markdown text. You can use any _inline-only_ feature that comes with Markdown, including `_inline_ **formatting**` and `[links](...)`. Additionally, you can insert JavaScript in `{{ double curly braces }}` - see [computed content](#computed-content).
  - `bars?`: [**Bar**]  
    A list of data to display as colored bars.
  - `size?`: _number_  
    The size of this cell, in relation to the other cells in the row. Defaults to 1. For example, if one cell in a row has a size of 3, and the other cell in the row has a size of 1 (the default), then the first cell will take up exactly 3x as much space as the second.
  - `align?`: _"left"_ | _"right"_ | _"center"_  
    The side to align text to. Does not affect bars.
  - `invert?`: _boolean_  
    Set to _true_ to make the text use the theme `bg` color (instead of the `text` color, the default). Does not affect bars.

- **Bar**
  - `fracx?`: _string_  
    "Fraction Expression" - a JavaScript expression that gets evaluated to determine what proportion of the total width of the cell that this bar should take up. If left blank, then this bar will take up the remaining space in the cell. For example, if you provide two bars, one with a `fracx` that evaluates to 0.1, and one with an empty `fracx`, then the two bars that get created will have widths of 10% and 90%, respectively. See [computed content](#computed-content) for more details on writing expressions.
  - `color?`: _string_  
    The color of this bar. Can be either the name of a color from the current theme, or any valid CSS color. Names from the current theme take precedence in the case of a naming collision.

- **Widget**
  - `widget`: _"theme-switcher"_  
    A pre-made widget. Right now all that exists is the theme switcher, a simple link-button that allows you to change the theme and remembers your choice across sessions.

- **Theme**
  - `text`: _string_  
    The color of text on the page. Can be any valid CSS color.
  - `bg`: _string_  
    The color of the page background.
  - `<anything else>`: _string_  
    Arbitrary named colors.

## Computed content

In order to let you display dynamic content in the way you want, you can insert evaluated code into Markdown blocks with `{{ double curly braces }}` or set the size of a bar with arbitrary JavaScript. The table below covers everything available, you can also see [systemData.ts](/src/lib/systemData.ts).

> Responsible disclosure: **I have intentionally not put any effort into making computed content run securely.** Soil is meant to be a simple startpage that runs a little bit of JavaScript in your browser for aesthetic purposes, not a production-viable system monitoring solution.
>
> Everything here in the computed content section is made possible by running JavaScript `eval`s in your browser, and assumes that all of the code being run (which comes exclusively from your _soil.config.yaml_) is trusted. These `eval`s have about the same amount of access to your computer as any other piece of JavaScript being run in that browser tab.

Now, on to the tables:

### Raw system data

System data is fetched using the [systeminformation](https://www.npmjs.com/package/systeminformation) library. Most of these fields have a corresponding entry (names edited for brevity and clarity, e.g. renaming _manufacturer_ to _make_) in their [documentation](https://systeminformation.io/v4/system.html). If you want to see exactly how data is fetched, see [`getSystemData()`](/src/routes/api/data/+server.ts).

| Var    | Field     | Type   | Description
| ------ | --------- | ------ | ---
| time   | now       | Date   | System time
|        | tz        | string | System timezone
| sys    | make      | string | Machine manufacturer name
|        | model     | string | Machine model name
|        | ver       | string | Machine version name
|        | arch      | string | System architecture
|        | up        | number | Uptime, in seconds
|        | hostname  | string | Hostname
| cpu    | make      | string | CPU manufacturer name
|        | model     | string | CPU model name
|        | ghz       | string | CPU speed, in GHz
|        | cores     | number | # of physical cores on the CPU
|        | load      | number | Current CPU load, as a fraction (0.0 - 1.0)
|        | temp.main | number | Main CPU temperature (probably in C, but I can't find where this is documented)
|        | temp.max  | number | Max CPU temperature
| gpu[i] | make      | string | GPU manufacturer name
|        | model     | string | GPU model name
|        | bus       | string | GPU bus
|        | vram      | number | VRAM size, in bytes
| mem    | total     | number | Total system memory, in bytes
|        | free      | number | Amount of free memory, in bytes
|        | used      | number | Amount of actively used memory, in bytes
| os     | platform  | string | Platform name (linux, Windows, etc.)
|        | distro    | string | Distro name
|        | release   | string | Distro release name
|        | kernel    | string | Kernel version

### Preformatted data for convenience

| Var | Field        | Type   | Description
| --- | ------------ | ------ | ---
| pre | localeTime   | string | Time as a locale string + timezone
|     | sysName      | string | System make + model + version
|     | uptimeClock  | string | Uptime formatted as a clock (e.g. "7d 12:30:01") 
|     | cpuName      | string | CPU make + model
|     | cpuInfo      | string | CPU make + model + cores + speed
|     | memTotalGiB  | number | Total mem in GiB
|     | memFreeGiB   | number | Free mem in GiB
|     | memUsedGiB   | number | Used mem in GiB
|     | memUsedFrac  | number | Used mem / total mem
|     | osName       | string | OS distro + release + system arch

### Utility functions for making display text easier

| Function signature                     | Description
| -------------------------------------- | ---
| fix(n: number, k: number)              | Format n into a string with k digits after the decimal
| clamp(n: number, a: number, b: number) | Clamp n between a and b

You can see examples of all of this coming together in [soil.config.yaml](./soil.config.yaml).

## Containerizing

If you want to run Soil inside a container, I've provided a simple [Dockerfile](./Dockerfile) and [compose.yaml](./compose.yaml) that builds a container for Soil using a node (Alpine) image.

> Note that due to the restricted capabilities of containers, the system data that gets fetched might not be entirely accurate if you run this way. For instance, `sys.model` shows "Docker Container" and `os.distro` shows "Alpine Linux".

Modify the variables indicated in the compose file then `docker compose up`.

## Credits

Inspiration: [SUI](https://github.com/jeroenpardon/sui), [Homepage](https://gethomepage.dev/latest/).