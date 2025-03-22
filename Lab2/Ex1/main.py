import pygame
import math
import copy
from transformations import *

pygame.init()
win = pygame.display.set_mode((600, 600))
pygame.display.set_caption("First Game")

YELLOW = (255, 255, 0)
BLUE = (0, 0, 255)

polygonCenter = pygame.Vector2(win.get_width() / 2, win.get_height() / 2)
polygon_points = []
angle = 2 * math.pi / 5

radius = 150
for i in range(5):
    x, y = polygonCenter.x + radius*math.cos(i * angle), polygonCenter.y + radius*math.sin(i * angle)
    res = pygame.Vector2(x,y)
    res -= polygonCenter
    res = res.rotate(54)
    res += polygonCenter
    polygon_points.append(res)

starting_points = copy.deepcopy(polygon_points)
staringCenter = copy.deepcopy(polygonCenter)

importantKeys = [ pygame.K_1, pygame.K_2, pygame.K_3, pygame.K_4, pygame.K_5, pygame.K_6, pygame.K_7, pygame.K_8, pygame.K_9 ]

run = True
while run:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
        if event.type == pygame.KEYDOWN:
            if event.key not in importantKeys:
                continue

            polygon_points = copy.deepcopy(starting_points)
            polygonCenter = copy.deepcopy(staringCenter)
            if event.key == pygame.K_1:
                scale(polygon_points, polygonCenter, 0.5, 0.75)
            if event.key == pygame.K_2:
                rotate(polygon_points, polygonCenter, 24)
            if event.key == pygame.K_3:
                scale(polygon_points, polygonCenter, 0.5, 1)
                flip_x(polygon_points, polygonCenter)
            if event.key == pygame.K_4:
                lean(polygon_points, polygonCenter, 0.25, 0)
            if event.key == pygame.K_5:
                move(polygon_points, pygame.Vector2(0, -148*3))
                scale(polygon_points, polygonCenter, 2, 0.5)
            if event.key == pygame.K_6:
                lean(polygon_points, polygonCenter, 0.25, 0)
                rotate(polygon_points, polygonCenter, -90)
            if event.key == pygame.K_7:
                flip_x(polygon_points, polygonCenter)
                flip_y(polygon_points, polygonCenter)
                scale(polygon_points, polygonCenter, 0.5, 1)
            if event.key == pygame.K_8:
                scale(polygon_points, polygonCenter, 2, 0.5)
                rotate(polygon_points, polygonCenter, -45)
                flip_y(polygon_points, polygonCenter)
                move(polygon_points, pygame.Vector2(-40, 45))
            if event.key == pygame.K_9:
                lean(polygon_points, polygonCenter, 0, 0.25)                
                rotate(polygon_points, polygonCenter, -180)
                move(polygon_points, pygame.Vector2(-200, 0))
                flip_y(polygon_points, polygonCenter)


    win.fill(YELLOW)
    pygame.draw.polygon(win, BLUE, polygon_points)

    pygame.display.update()