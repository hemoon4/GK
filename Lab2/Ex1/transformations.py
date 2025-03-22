import numpy as np
import math

def move(polygon_points, targetVec):
    a = np.array([[1, 0, targetVec.x],
                  [0, 1, targetVec.y],
                  [0, 0,  1]])
    for vec in polygon_points:
        b = np.array([[vec.x],
                      [vec.y],
                      [  1  ]])
        result = np.matmul(a, b)
        movedX = result[0][0]
        movedY = result[1][0]
        vec.xy = movedX, movedY

def rotate(polygon_points, centerVector, angle):
    radians = math.radians(angle)
    cosVal = math.cos(radians)
    sinVal = math.sin(radians)
    a = np.array([[cosVal, -sinVal, 0],
                    [sinVal,  cosVal, 0],
                    [     0,       0, 1]])
    for vec in polygon_points:
        b = np.array([[vec.x - centerVector.x],
                      [vec.y - centerVector.y],
                      [           1          ]])
        result = np.matmul(a, b)
        movedX = result[0][0]
        movedY = result[1][0]             
        vec.xy = movedX + centerVector.x, movedY + centerVector.y

def flip_x(polygon_points, centerVector):
    a = np.array([[ 1,  0, 0],
                  [ 0, -1, 0],
                  [ 0,  0, 1]])
    for vec in polygon_points:
        b = np.array([[vec.x-centerVector.x],
                      [vec.y-centerVector.y],
                      [  1  ]])
        result = np.matmul(a, b)
        movedX = result[0][0]
        movedY = result[1][0]
        vec.xy = movedX + centerVector.x, movedY + centerVector.y

def flip_y(polygon_points, centerVector):
    a = np.array([[-1,  0, 0],
                  [0, 1, 0],
                  [0,  0, 1]])
    for vec in polygon_points:
        b = np.array([[vec.x-centerVector.x],
                      [vec.y-centerVector.y],
                      [  1  ]])
        result = np.matmul(a, b)
        movedX = result[0][0]
        movedY = result[1][0]
        vec.xy = movedX + centerVector.x, movedY + centerVector.y

def scale(polygon_points, centerVector, scaleX, scaleY):
    a = np.array([[scaleX, 0, 0],
                  [0, scaleY, 0],
                  [0, 0, 1]])
    for vec in polygon_points:
        b = np.array([[vec.x-centerVector.x],
                      [vec.y-centerVector.y],
                      [  1  ]])
        result = np.matmul(a, b)
        movedX = result[0][0]
        movedY = result[1][0]
        vec.xy = movedX + centerVector.x, movedY + centerVector.y

def lean(polygon_points, centerVector, leanFactorX, leanFactorY):
    a = np.array([[1, leanFactorX, 0],
                  [leanFactorY, 1, 0],
                  [0, 0, 1]])
    for vec in polygon_points:
        b = np.array([[vec.x-centerVector.x],
                      [vec.y-centerVector.y],
                      [  1  ]])
        result = np.matmul(a, b)
        movedX = result[0][0]
        movedY = result[1][0]
        vec.xy = movedX + centerVector.x, movedY + centerVector.y