"""Tables, Widgets, and Groups!
An example of tables and most of the included widgets.
"""

import pygame
from pygame.locals import *

# the following line is not needed if pgu is installed
import sys; sys.path.insert(0, "..")

from pgu import gui
# Load an alternate theme to show how it is done. You can also 
# specify a path (absolute or relative) to your own custom theme:
#
#   app = gui.Desktop(theme=gui.Theme("path/to/theme"))
#
app = gui.Desktop(theme=gui.Theme("./data/themes/default"))
app.connect(gui.QUIT,app.quit,None)

##::
WIDTH = 640
HEIGHT = 320
ctn = gui.Container() 

ctn.add(gui.Label("ZScripts path:"),5,0)

def cb():
    print("Input received")
pathInput = gui.Input(value='',size=90)
pathInput.connect("activate", cb)
ctn.add(pathInput,120,0)

#zremesher
ctnZR = gui.Container()
ctn.add(ctnZR,0,35)

btn = gui.Button("ZRemesher")
btn.connect(gui.CLICK, cb)
ctnZR.add(btn,0,0)

ctnZR.add(gui.Label("Polygons count "),5,25)
ctnZR.add(gui.HSlider(value=2,min=2,max=20,size=20,width=250),5,50)
#zdynamesh

ctnZD = gui.Container()
ctn.add(ctnZD,0,125)

btn = gui.Button("ZDynamesh")
btn.connect(gui.CLICK, cb)
ctnZD.add(btn,0,0)

ctnZD.add(gui.Label("Resolution "),5,25)
ctnZD.add(gui.HSlider(value=2,min=2,max=20,size=20,width=250),5,50)
###### object list
objList = gui.List(width=150, height=550)
ctn.add(objList, 280, 35)


#####
global screen
pygame.display.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.DOUBLEBUF)
app.run(ctn)


