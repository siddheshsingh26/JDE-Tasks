/**

@file main.cpp
This is a program to find the longest path in a labyrinth.
The labyrinth is stored in a text file, where '.' represents a valid path
and '#' represents a wall. The output of the program is the length of
the longest path and the labyrinth with the longest path marked.
*/
#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;


// Constants for possible moves in the labyrinth
const int dx[] = { 0, 0, 1, -1, 1, -1, 1, -1 };

const int dy[] = { 1, -1, 0, 0, 1, -1, -1, 1 };

vector<string> labyrinth;
vector<vector < int>> visited;
unordered_map<int, vector < int>> store;

/**

Check if the move is valid (i.e., within the bounds of the labyrinth and to a valid path)
@param x the current x-coordinate
@param y the current y-coordinate
@return true if the move is valid, false otherwise
*/

bool is_valid_move(int x, int y)
{
	return x >= 0 && x < labyrinth.size() && y >= 0 && y < labyrinth[0].size() && labyrinth[x][y] == '.';
}

/** 
Run depth-first search to find the longest path starting at (x,y)

@param x the current x-coordinate

@param y the current y-coordinate

@param path_length the length of the current path

@param is_longest_path whether the current path is the longest path

@param only1 whether this is the first path found of length path_length
*/

void dfs(int x, int y, int &path_length, bool &is_longest_path, bool &only1)
{
	visited[x][y] = 1;

	path_length++;
	labyrinth[x][y] = '.';

	string cord;

	for (int i = 0; i < 8; i++)
	{
		int new_x = x + dx[i];
		int new_y = y + dy[i];
		if (is_valid_move(new_x, new_y) && !visited[new_x][new_y])
		{
			dfs(new_x, new_y, path_length, is_longest_path, only1);

			// Store the coordinates of each visited cell for each path length
			store[path_length].push_back(new_x);
			store[path_length].push_back(new_y);

			// Backtrack and mark as non-longest path if not the longest path
			if (!is_longest_path)
			{
				labyrinth[new_x][new_y] = '.';
			}
		}
	}

	// If reached the top row, store the end cell
	if (x == 0)
	{
		store[path_length].push_back(x);
		store[path_length].push_back(y);
	}

	is_longest_path = true;
}




/**



Find the longest path in the labyrinth
@return the length of the longest path
*/

int find_longest_path()
{
	int longest_path_length = -1;
	for (int i = 0; i < labyrinth[0].size(); i++)
	{
		if (labyrinth[0][i] == '.')
		{
			visited = vector<vector < int>> (labyrinth.size(), vector<int> (labyrinth[0].size(), 0));
			int path_length = 0;

			bool is_longest_path = false;
			bool only1 = true;

            // Start dfs from cell in first row
			dfs(0, i, path_length, is_longest_path, only1);	

			// If the current path is longer than the longest path found so far, update the longest path
			if (is_longest_path)
			{
				longest_path_length = max(longest_path_length, path_length);
			}
		}
	}

	return longest_path_length;
}

int main()
{
	// Read the labyrinth from input file
    string file_name;

    cout<<"Enter input file name "<<endl;
    cin>>file_name;

	ifstream infile(file_name);
	string line;
	int row = 0;

	while (getline(infile, line))
	{
		labyrinth.push_back(line);
		row++;
	}

	//Determining the longest path length
	int longest_path_length = find_longest_path();
	//Examining the validity of the path
	if (longest_path_length == -1 || store[longest_path_length][0] != row - 1)
	{
		//Whenever the path is invalid
		//Print -1 and the path
		cout << -1 << endl;
		for (string line: labyrinth)
		{
			cout << line << endl;
		}
	}
	else
	{
		// Whenever the path is valid
		// Print the length of the longest path and path
		cout << longest_path_length << endl;
		int count = longest_path_length - 1;
		for (int i = 0; i < store[longest_path_length].size(); i = i + 2)
		{
			labyrinth[int(store[longest_path_length][i])][int(store[longest_path_length][i + 1])] = count + 48;
			count--;
			//When two or more eligible pathways have the same length, the count must be reset.
			if (count < 0)
			{
				count = longest_path_length - 1;
			}
		}

		//The result is Printed
		for (string line: labyrinth)
		{
			cout << line << endl;
		}
	}

	return 0;
}