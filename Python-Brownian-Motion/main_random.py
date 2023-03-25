# Import the necessary libraries
import pygame # For creating the graphical interface
import random # For generating random numbers
import math # For mathematical operations

# Set up the window
pygame.init() # Initialize pygame module
WINDOW_SIZE = (1100, 770) # Set the dimensions of the window
screen = pygame.display.set_mode(WINDOW_SIZE) # Create the window

# Set up the parameters for the simulation
NUM_PARTICLES = 1 # Number of particles to simulate
PARTICLE_SIZE = 2 # Size of the particles
PARTICLE_COLOR = (255, 255, 255) # Color of the particles
BOUNDARY_THICKNESS = 5 # Thickness of the boundary
BOUNDARY_COLOR = (255, 0, 0) # Color of the boundary
SIZE = 20 # Size of the ball
BALLS_COLOR = (0, 255, 175) # Color of the ball

# Define a Particle class
class Particle:
    def __init__(self):
        self.x = random.randint(SIZE, WINDOW_SIZE[0]-SIZE) # Initialize x-coordinate randomly within the screen boundaries
        self.y = random.randint(SIZE, WINDOW_SIZE[1]-SIZE) # Initialize y-coordinate randomly within the screen boundaries
        self.vx = random.uniform(-1, 1) # Initialize the velocity in x-direction randomly
        self.vy = random.uniform(-1, 1) # Initialize the velocity in y-direction randomly

    def move(self):
        self.x += self.vx # Update the x-coordinate by adding the velocity in x-direction
        self.y += self.vy # Update the y-coordinate by adding the velocity in y-direction

        # Bounce off the edges of the screen
        if self.x < SIZE or self.x > WINDOW_SIZE[0]-SIZE: # If the particle hits the left or right edge of the screen
            self.vx = random.uniform(0.1, 1) if self.vx < 0 else random.uniform(-1, -0.1) # Reverse the velocity in x-direction
            self.vy = random.uniform(0.1, 1) if self.vy < 0 else random.uniform(-1, -0.1) # Randomly change the velocity in y-direction

        if self.y < SIZE or self.y > WINDOW_SIZE[1]-SIZE: # If the particle hits the top or bottom edge of the screen
            self.vy = random.uniform(0.1, 1) if self.vy < 0 else random.uniform(-1, -0.1) # Reverse the velocity in y-direction
            self.vx = random.uniform(0.1, 1) if self.vx < 0 else random.uniform(-1, -0.1) # Randomly change the velocity in x-direction

    def draw(self):
        pygame.draw.circle(screen, BALLS_COLOR, (int(self.x), int(self.y)), SIZE) # Draw the particle as a circle

# Create the particles
particles = [Particle() for _ in range(NUM_PARTICLES)] # Create a list of particles using the Particle class

# Start the simulation loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    
    # Move and draw the particles
    screen.fill((0, 0, 0))  # Fill the screen with black

    # Draw the boundaries
    pygame.draw.rect(screen, BOUNDARY_COLOR, (0, 0, WINDOW_SIZE[0], BOUNDARY_THICKNESS)) # Top boundary
    pygame.draw.rect(screen, BOUNDARY_COLOR, (0, 0, BOUNDARY_THICKNESS, WINDOW_SIZE[1])) # Left boundary
    pygame.draw.rect(screen, BOUNDARY_COLOR, (0, WINDOW_SIZE[1]-BOUNDARY_THICKNESS, WINDOW_SIZE[0], BOUNDARY_THICKNESS)) # Bottom boundary
    pygame.draw.rect(screen, BOUNDARY_COLOR, (WINDOW_SIZE[0]-BOUNDARY_THICKNESS, 0, BOUNDARY_THICKNESS, WINDOW_SIZE[1])) # Right boundary

    # Draw the particles
    for particle in particles:
        particle.move()  # Update the position of the particle
        particle.draw()  # Draw the particle on the screen

    pygame.display.flip()  # Update the screen
pygame.quit()

