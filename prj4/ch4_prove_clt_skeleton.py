import numpy as np
import matplotlib.pyplot as plt
import scipy.stats as stats

nvec = (1, 2, 5, 10, 100, 1000) # numbers of RVs to be averaged and standardized
K = 10000 # number of samples
# parameters for U[a,b]
a = 0.0
b = 10.0
mu = ?? #mean of U[a,b] 
sigma = ?? #standard deviation of U[a,b]

# empirical CDF
def ecdf(x):
	xs = np.sort(x)
	ys = np.arange(1, len(xs)+1)/float(len(xs))
	return xs, ys

xf = np.linspace(-5,5,100)
F = stats.norm.cdf(xf) #values of standard noraml CDF

for n in nvec:
    # sum of K samples of uniform RV~U[a,b]
    # calculate Z
    # calculate empirical CDF (eCDF) of Z
    
    # plot eCDF and F

plt.show()
