/**
 * Created by rtdl-liaoyueling on 2019/1/11.
 */
export const mouseover = ($event,title) => {
  let dom = $event.target;
  if(dom.offsetWidth<=dom.scrollWidth){
     showTitle(dom,title)
    return
  }
}
function showTitle(el, title) {
  const popover = getPopover()
  const popoverStyle = popover.style
  const arrowStyle=popover.querySelector('.popper__arrow').style

  if (title === undefined || title === null|| title === "") {
    popoverStyle.display = 'none'
  } else {
    const elRect = el.getBoundingClientRect()
    const elComputedStyle = window.getComputedStyle(el, null)
    const rightOffset = parseInt(elComputedStyle.getPropertyValue('padding-right')) || 0
    const topOffset = parseInt(elComputedStyle.getPropertyValue('padding-top')) || 0

    popoverStyle.visibility = 'hidden'
    popoverStyle.display = 'block'
    popover.querySelector('.popover-content').textContent = title
    popoverStyle.left = elRect.left - popover.offsetWidth / 2 + (el.offsetWidth - rightOffset) / 2 + 'px'
    popoverStyle.top = elRect.top - popover.offsetHeight + topOffset + 'px'
    popoverStyle.display = 'block'
    popoverStyle.visibility = 'visible'
    arrowStyle.left=popover.offsetWidth / 2 + 'px'
  }
}

function getPopover() {
  let popover = document.querySelector('.title-popover')
  if (!popover) {
    const tpl = `
      <div class="el-tooltip__popper is-dark popover title-popover top fade in" style="position:fixed;" x-placement="top">
        <div class="popper__arrow" style=""></div>
        <div class="popover-content"></div>
      </div>
    `
    const fragment = document.createRange().createContextualFragment(tpl)
    document.body.appendChild(fragment)
    popover = document.querySelector('.title-popover')
  }
  return popover
}
//鼠标移出浮层消失
export const mouseout = ($event) => {
  let bgObj = document.querySelector('.title-popover');
  if (bgObj) {
    document.body.removeChild(bgObj);
  }
}
