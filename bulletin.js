let container = document.querySelector('#board')

// data ========================================================================
let config = {
  default_width: 200,
  default_height: 200,
  default_action_a: (name) => {
    let v = document.querySelector(`#${name.replace(/ /g, '-')}-a`).value.trim()
    if (v.length > 0) {
      append(name, v)
      show()
    }
  },
}
let data = [
]

// routines ====================================================================
let show = () => {
  container.innerHTML = ''
  data.forEach(p => {
    let name = p.name
    let top = p.top
    let left = p.left
    let content = p.content
    let width = config.default_width
    let height = config.default_height
    let action_a = p.action_a
    let mk = (name, top, left, width, height, content) => {
      return `<div class='bb-p w3-card-4 w3-padding' id='${name.replace(/ /g, '-')}-p' ` +
        `style='top: ${top}px; left: ${left}px; min-width: ${width}px; min-height: ${height}px;'>` +
        `<div class='bb-p-h'><span>${name}</span></div>${content.join('<br>')}` +
        `<form onsubmit="data.forEach(p => { if (p.name === '${name}') config.default_action_a('${name}') }); return false" ` +
        `class='w3-container' style='padding: 0;'>` +
        `<input class='w3-input bb-p-a' type='text' ` +
        `id='${name.replace(/ /g, '-')}-a' autocomplete='off' style='padding: 10px 0 0;'>` +
        `</form></div>`
    }
    container.innerHTML += mk(name, top, left, width, height, content)
  })
}
let append = (p_name, text) => {
  data.forEach(p => {
    if (p.name === p_name) {
      p.content.push(text)
    }
  })
}

// adjust style ================================================================
container.style.height = window.innerHeight + 'px'

// execute =====================================================================
show()

// debug and test ==============================================================
let create_data_test_1 = () => {
  data.push(
    {
      name: 'YouTube Movies',
      top: 100,
      left: 100,
      content: [
        'Up (6.3)',
        'Wild Wild West (5.26)',
        'Me Before You (6.8)',
      ],
    }
  )
  show().then(() => draggable(document.querySelector(`${name.replace(/ /g, '-')}-p`)))
}
let create_data_test_2 = () => {
  data.push(
    {
      name: 'Reminder 1',
      top: 100,
      left: 420,
      content: [
        'NPP notes',
        'update SIO address',
        'update Amazon billing addresses',
        'email Penrose',
      ],
    }
  )
  show()
}
