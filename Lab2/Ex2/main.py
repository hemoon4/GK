import pygame

pygame.init()

win = pygame.display.set_mode((600, 600))
pygame.display.set_caption("First Game")

# deklarowanie kolorów
WHITE = (255, 255, 255)
YELLOW = (255, 255, 0)
BLACK = (0, 0, 0)

# dodac transakcje pieciokata (w moim przypadku
# zadanie 2:  wariant % 4 ja mam pierwsze

win.fill(WHITE)
center_x, center_y = win.get_width() / 2, win.get_height() / 2
size = 100

run = True
while run:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False

    pygame.draw.circle(win, BLACK, (center_x, center_y), size)
    pygame.draw.rect(win, YELLOW, (center_x - size / 2, center_y - size / 2, size, size))
    pygame.display.update()