from GUI import GUI
from HAL import HAL
import cv2
import numpy as np
import time

# Constants used in the PID algorithm
kp = 0.042
ki = 0
kd = 0.063
Max_Angle = 80
prev_err = 0
area = 0
speed = 3

def MaskImage(image, result):
    # Define the upper and lower bounds for the red color range in HSV color space
    # Since the Red color range in HSV is a circle, we have to define two ranges and add them for accurate detection

    # Lower and upper bounds for the first range of Red color
    lower1 = np.array([0, 80, 10])
    upper1 = np.array([15, 255, 255])
    
    # Lower and upper bounds for the second range of Red color
    lower2 = np.array([170,80,10])
    upper2 = np.array([180,255,255])
    
    # Generate a mask for the two color ranges
    upper_mask = cv2.inRange(image, lower2, upper2)
    lower_mask = cv2.inRange(image, lower1, upper1)
    
    # Combine the two masks to create a complete mask
    full_mask = lower_mask + upper_mask
    
    # Use bitwise AND operation to extract the red line from the original image
    masked = cv2.bitwise_and(result, result, mask=full_mask)

    return (masked, full_mask)

def CalculateAngle(err):
    global prev_err, area

    # Calculate the difference in error to obtain the rate of change of error w.r.t time
    rate_of_change = err - prev_err
    # Add the error to the area to simulate integration
    area += err
    
    # Calculate the proportional, integral, and derivative terms of the PID algorithm
    d_term = kd * rate_of_change
    i_term = ki * area
    p_term = kp * err

    # Combine the three terms to calculate the angle required for the car to stay on track
    angle = p_term + d_term + i_term

    prev_err = err

    # Apply a rudimentary bounding function to limit the angle values between -Max_Angle and Max_Angle
    if angle > Max_Angle:
        angle = Max_Angle
    elif angle < -Max_Angle:
        angle = -Max_Angle
        
    return angle 

# Continuously run the following loop until interrupted
while True:
    # Get the current image from the HAL (Hardware Abstraction Layer)
    image = HAL.getImage()
    result = image.copy()
    
    # Convert the image to HSV color space for better color detection
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Generate a mask to isolate the red color from the image
    (masked, mask) = MaskImage(hsv, result)
    
    # Calculate the moments of the mask to obtain the centroid of the red line
    M = cv2.moments(mask)
    
    # Check if the moment 'm00' is non-zero to prevent divide by zero error
    if M['m00'] > 0:
    # Calculate the centroid of the masked region
        c_x = int(M["m10"]/M["m00"])
        c_y = int(M["m01"]/M["m00"])
        
        # Draw a circle at the centroid position
        cv2.circle(image, (c_x, c_y), 4, (0, 180, 0), -1)
        
        # Display the original image with the centroid circle drawn on it
        GUI.showImage(image)
        
        # Calculate the error as the difference between the centroid x-coordinate and the center of the image
        err = masked.shape[1]/2 - c_x  
        # Positive error implies the red line is to the left of the center, so the car needs to turn left
        # Negative error implies the red line is to the right of the center, so the car needs to turn right
        
        # Calculate the required angle correction using PID control
        angle = CalculateAngle(err) / 10
        
        # Set the car's speed to a fixed value
        HAL.setV(speed)
        
        # Only set the car's turning angle if the error is greater than a small threshold
        if not (err < 4 and err > -4):
            HAL.setW(angle)
        
    # Wait for a short time before processing the next frame
    time.sleep(0.02) # Delay of 20ms

