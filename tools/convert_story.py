#!/usr/bin/env python3
"""
Ren'Py to Unity Story Converter
Converts Ren'Py .rpy scripts to Unity-compatible JSON format
"""

import re
import json
import os
from pathlib import Path

class RenpyParser:
    def __init__(self):
        self.scenes = []
        self.current_scene = None
        self.current_label = None
        
    def parse_file(self, filepath):
        """Parse a single .rpy file"""
        print(f"Parsing {filepath}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        i = 0
        while i < len(lines):
            line = lines[i]
            i = self.parse_line(line, lines, i)
        
        # Save last scene
        if self.current_scene:
            self.scenes.append(self.current_scene)
            
        return self.scenes
    
    def parse_line(self, line, lines, index):
        """Parse a single line"""
        stripped = line.strip()
        
        # Label (new scene)
        if stripped.startswith('label '):
            if self.current_scene:
                self.scenes.append(self.current_scene)
            
            label_name = re.match(r'label\s+(\w+):', stripped)
            if label_name:
                self.current_label = label_name.group(1)
                self.current_scene = {
                    'label': self.current_label,
                    'background': None,
                    'music': None,
                    'dialogues': [],
                    'choices': [],
                    'jumps': [],
                    'narrator': []
                }
        
        # Character dialogue
        elif stripped.startswith(('m "', 'f "', 'e "')):
            if self.current_scene:
                char_map = {'m': 'Mia', 'f': 'Fernando', 'e': 'Ellysa'}
                char = char_map.get(stripped[0])
                text = self.extract_quoted_text(stripped)
                
                if text:
                    self.current_scene['dialogues'].append({
                        'character': char,
                        'text': text
                    })
        
        # Narrator (descriptive text in quotes)
        elif stripped.startswith('"') and not stripped.startswith('"""'):
            if self.current_scene:
                text = self.extract_quoted_text(stripped)
                if text:
                    self.current_scene['narrator'].append(text)
        
        # Scene command (background)
        elif stripped.startswith('scene '):
            if self.current_scene:
                bg_match = re.search(r'scene\s+([\w_]+)', stripped)
                if bg_match:
                    self.current_scene['background'] = bg_match.group(1)
        
        # Play music
        elif stripped.startswith('play music'):
            if self.current_scene:
                music_match = re.search(r'play music\s+["\']?(\w+)["\']?', stripped)
                if music_match:
                    self.current_scene['music'] = music_match.group(1)
                elif 'bg_music_room' in stripped:
                    self.current_scene['music'] = 'bg_music_room'
                elif 'bg_school_yard' in stripped:
                    self.current_scene['music'] = 'bg_school_yard'
                elif 'bg_night_room' in stripped:
                    self.current_scene['music'] = 'bg_night_room'
        
        # Jump
        elif stripped.startswith('jump '):
            if self.current_scene:
                jump_match = re.match(r'jump\s+(\w+)', stripped)
                if jump_match:
                    self.current_scene['jumps'].append(jump_match.group(1))
        
        # Menu (choices)
        elif stripped.startswith('menu:'):
            if self.current_scene:
                # Parse menu choices
                menu_choices = self.parse_menu(lines, index + 1)
                self.current_scene['choices'].extend(menu_choices)
        
        return index + 1
    
    def parse_menu(self, lines, start_index):
        """Parse menu choices"""
        choices = []
        i = start_index
        
        while i < len(lines):
            line = lines[i].strip()
            
            # End of menu
            if line and not line.startswith('"') and not line.startswith('jump') and not line.startswith('$'):
                break
            
            # Choice text
            if line.startswith('"'):
                choice_text = self.extract_quoted_text(line)
                choice_obj = {'text': choice_text, 'jump': None, 'variables': []}
                
                # Look for jump in next line
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if next_line.startswith('jump '):
                        jump_match = re.match(r'jump\s+(\w+)', next_line)
                        if jump_match:
                            choice_obj['jump'] = jump_match.group(1)
                    elif next_line.startswith('$'):
                        # Variable assignment
                        var_match = re.search(r'\$\s*persistent\.(\w+)\s*=\s*["\'](\w+)["\']', next_line)
                        if var_match:
                            choice_obj['variables'].append({
                                'name': var_match.group(1),
                                'value': var_match.group(2)
                            })
                
                choices.append(choice_obj)
            
            i += 1
        
        return choices
    
    def extract_quoted_text(self, line):
        """Extract text between quotes"""
        match = re.search(r'"([^"]+)"', line)
        return match.group(1) if match else None
    
    def to_json(self, output_file):
        """Export parsed data to JSON"""
        data = {
            'scenes': self.scenes,
            'metadata': {
                'total_scenes': len(self.scenes),
                'total_dialogues': sum(len(s['dialogues']) for s in self.scenes),
                'total_choices': sum(len(s['choices']) for s in self.scenes)
            }
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\nExported to {output_file}")
        print(f"  - {data['metadata']['total_scenes']} scenes")
        print(f"  - {data['metadata']['total_dialogues']} dialogues")
        print(f"  - {data['metadata']['total_choices']} choices")

def main():
    """Main conversion function"""
    script_dir = Path('Assets/StoryData')
    output_dir = Path('Assets/StoryData/Converted')
    output_dir.mkdir(exist_ok=True)
    
    rpy_files = [
        'script.rpy',
        'script_mia.rpy',
        'script_fernando.rpy'
    ]
    
    all_scenes = []
    
    for rpy_file in rpy_files:
        filepath = script_dir / rpy_file
        if filepath.exists():
            parser = RenpyParser()
            scenes = parser.parse_file(filepath)
            
            # Export individual file
            output_file = output_dir / f"{filepath.stem}.json"
            parser.to_json(output_file)
            
            all_scenes.extend(scenes)
        else:
            print(f"Warning: {filepath} not found")
    
    # Export combined JSON
    combined_parser = RenpyParser()
    combined_parser.scenes = all_scenes
    combined_parser.to_json(output_dir / 'combined_story.json')
    
    print(f"\n✅ Conversion complete!")
    print(f"   Total scenes across all files: {len(all_scenes)}")

if __name__ == '__main__':
    main()
