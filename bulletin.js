let container = document.querySelector('#board')

// data ========================================================================
//                                                                              data
let init_config = {
  default_width: 200,
  default_height: 200,
}
let init_data = [
]
let default_action_a = (name) => {
  let v = document.querySelector(`#${name.replace(/ /g, '-')}-a`).value.trim()
  if (v.length > 0) {
    append(name, v)
    show()
    document.querySelector(`#${name.replace(/ /g, '-')}-a`).focus()
  }
}
let show_callback_draggable = (name) => {
  draggable(document.querySelector(`#${name.replace(/ /g, '-')}-p`), () => {
    let ele = document.querySelector(`#${name.replace(/ /g, '-')}-p`)
    data.forEach(p => {
      if (p.name === name) {
        p.top = parseInt(ele.style.top)
        p.left = parseInt(ele.style.left)
      }
    })
    data.forEach(p => {
      let n = p.name
      let e = document.querySelector(`#${name.replace(/ /g, '-')}-p`)
      e.style.zIndex = n === name ? 999 : 1
    })
  })
}

// routines ====================================================================
//                                                                              routines
let show = () => {
  container.innerHTML = ''
  data.forEach(p => {
    let name = p.name
    let top = p.top
    let left = p.left
    let content = p.content
    let width = config.default_width
    let height = config.default_height
    let j = (content) => {
      let s = []
      for (let i = 0; i < content.length; i++)
        s.push(`<span class='bb-p-l-i' id='item-${i}'>${content[i]}</span>`)
      return s
    }
    let mk = (name, top, left, width, height, content) => {
      return `<div class='bb-p w3-card-4 w3-padding' id='${name.replace(/ /g, '-')}-p' ` +
        `style='top: ${top}px; left: ${left}px; min-width: ${width}px; min-height: ${height}px;'>` +
        `<div class='bb-p-h'><span>${name}</span></div>${j(content).join('<br>')}` +
        `<form onsubmit="data.forEach(p => { if (p.name === '${name}') default_action_a('${name}') }); return false" ` +
        `class='w3-container' style='padding: 0;'>` +
        `<input class='w3-input bb-p-a' type='text' ` +
        `id='${name.replace(/ /g, '-')}-a' autocomplete='off' style='padding: 10px 0 0;'>` +
        `</form></div>`
    }
    container.innerHTML += mk(name, top, left, width, height, content)
  })
  data.forEach(p => {
    if (p.draggable)
      show_callback_draggable(p.name)
  })
  data.forEach(p => {
    let name = p.name
    let len = p.content.length
    for (let i = 0; i < len; i++)
      document.querySelector(`#${name.replace(/ /g, '-')}-p span#item-${i}`)
        .addEventListener('click', () => item_action(name, i))
  })
}
let append = (p_name, text) => {
  data.forEach(p => {
    if (p.name === p_name) {
      p.content.push(text)
    }
  })
}
let item_action = (name, i) => {
  let modal = document.querySelector('#item-action')
  let v = ''
  data.forEach(p => {
    if (p.name === name)
      v = p.content[i]
  })
  modal.style.display = 'block'
  modal.innerHTML = `<div><b>${name}</b><br>${v}</div>` +
    `<button class='w3-button w3-block w3-hover-black'>Delete</button>`
  document.querySelector('#item-action button').addEventListener('click', () => {
    modal.style.display = 'none'
    data.forEach(p => {
      if (p.name === name)
        p.content.splice(i, 1)
    })
    return show()
  })
}

// adjust style ================================================================
//                                                                              adjust style
container.style.height = window.innerHeight + 'px'

// execute =====================================================================
//                                                                              execute
let db = window.localStorage
if (db.getItem('config') === null) db.setItem('config', JSON.stringify(init_config))
if (db.getItem('data') === null) db.setItem('data', JSON.stringify(init_data))
let config = JSON.parse(db.getItem('config'))
let data = JSON.parse(db.getItem('data'))

setTimeout(show, 1000)
setTimeout(() => window.onbeforeunload = () => {
  db.setItem('config', JSON.stringify(config))
  db.setItem('data', JSON.stringify(data))
}, 1000)

document.querySelector('#new-p').addEventListener('click', () => {
  document.querySelector('#new-p-f').style.display = 'block'
})
