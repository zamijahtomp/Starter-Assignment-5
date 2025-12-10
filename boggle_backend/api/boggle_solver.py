"""Zamijah Shakeur-Tompkins 004004602"""
import re


class Boggle:
    """Initialize the Boggle game with a grid, dictionary, solutions list"""
    def __init__(self, grid, dictionary):
        self.grid = grid
        self.dictionary = dictionary
        self.solutions = []

    def getSolution(self):
        # 1. Check input parameters are valid
        if self.grid is None or self.dictionary is None:
            return self.solutions

        # 1b. Check if grid is NxN
        N = len(self.grid)
        for row in self.grid:
            if len(row) != N:
                return self.solutions

        # Convert input data into the same case
        self.convert_case_to_lower(self.grid, self.dictionary)

        # Check if grid is valid
        if not self.is_grid_valid(self.grid):
            return self.solutions

        # Setup all data structures
        sltns = set()
        hash = self.create_hash(self.dictionary)

        # Iterate over the Nx grid - find all words that begin with grid
        for y in range(N):
            for x in range(N):
                word = ""
                visited = [[False for _ in range(N)] for _ in range(N)]
                self.solver(word, y, x, self.grid, visited, hash, sltns)

        self.solutions = list(sltns)
        return self.solutions

    """Recursive function for main game code"""
    def solver(self, word, y, x, grid, visited, hash, sltns):
        # Base Case: y and x are out of bounds or already visited
        if y < 0 or x < 0 or y >= len(grid) or x >= len(grid) or visited[y][x]:
            return
        # Append grid[y][x] to the word
        word += grid[y][x]
        # Check if the new word is a prefix for any word in the hash
        if word not in hash:
            return
        # Mark as visited
        visited[y][x] = True
        # Check if it's an actual word in the dictionary
        if hash.get(word) == 1:
            if len(word) >= 3:
                sltns.add(word)
        # Continue searching using the adjacent tiles
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                if dy == 0 and dx == 0:
                    continue
                self.solver(word, y + dy, x + dx, grid, visited, hash, sltns)
        # Unmark location y, x as visited
        visited[y][x] = False

    """convert all letters to lowercase for easy manipulation"""
    def convert_case_to_lower(self, grid, dictionary):
        for i in range(len(grid)):
            for j in range(len(grid[i])):
                self.grid[i][j] = grid[i][j].lower()

        for i in range(len(dictionary)):
            self.dictionary[i] = dictionary[i].lower()
    """Check if grid is valid"""
    def is_grid_valid(self, grid):
        regex = r'st|qu|[a-z]'
        for row in grid:
            for cell in row:
                if not re.match(regex, cell.lower()):
                    return False
        return True
    """Create hash map to keep track of possible solutions"""
    def create_hash(self, dictionary):
        hash = {}
        for word in dictionary:
            hash[word] = 1  # Mark as a full word
            for i in range(1, len(word)):
                prefix = word[:i]
                if prefix not in hash:
                    hash[prefix] = 0  # Mark as a prefix
        return hash


def main():
    grid = [["T", "W", "Y", "R"], ["E", "N", "P", "H"],["G", "Z", "Qu", "R"],["O", "N", "T", "A"]]
    dictionary = ["art", "ego", "gent", "get", "net", "new", "newt", "prat", "pry", "qua", "quart", "quartz", "rat", "tar", "tarp", "ten", "went", "wet", "arty", "rhr", "not", "quar"]

    mygame = Boggle(grid, dictionary)
    print(mygame.getSolution())


if __name__ == "__main__":
    main()