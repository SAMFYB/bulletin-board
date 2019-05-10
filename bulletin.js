let container = document.querySelector('#board')

// data
let config = {
  default_width: 200,
  default_height: 200,
}
let data = [
  {
    name: 'YouTube Movies',
    top: 100,
    left: 100,
    content: [
      'Up (6.3)',
      'Wild Wild West (5.26)',
      'Me Before You (6.8)',
    ],
  },
]

// routines
let show = () => {
  data.forEach(p => {
    let name = p.name
    let top = p.top
    let left = p.left
    let content = p.content
    let width = config.default_width
    let height = config.default_height
    let mk = (name, top, left, width, height, content) => {
      return `<div class='bb-p w3-card-4 w3-padding' ` +
        `style='top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;'>` +
        `<div class='bb-p-h'>${name}</div>${content.join('<br>')}` +
        `<form class='w3-container' style='padding: 0;'>` +
        `<input class='w3-input' type='text' id='${name}-a' autocomplete='off' style='padding: 10px 0 0;'>` +
        `</form></div>`
    }
    container.innerHTML += mk(name, top, left, width, height, content)
  })
}

// adjust style
container.style.height = window.innerHeight + 'px'

// execute
show()
