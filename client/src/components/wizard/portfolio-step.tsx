import { useState } from "react";
import { Plus, Trash2, ExternalLink, Star, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { PortfolioProject } from "@shared/schema";

interface PortfolioStepProps {
  projects: PortfolioProject[];
  onChange: (projects: PortfolioProject[]) => void;
}

export function PortfolioStep({ projects, onChange }: PortfolioStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<PortfolioProject>({
    id: "",
    title: "",
    description: "",
    image: "",
    technologies: [],
    liveUrl: "",
    sourceUrl: "",
    featured: false,
  });
  const [techInput, setTechInput] = useState("");

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      image: "",
      technologies: [],
      liveUrl: "",
      sourceUrl: "",
      featured: false,
    });
    setTechInput("");
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleSaveProject = () => {
    if (!formData.title.trim()) return;

    const newProjects = [...projects];
    const projectToSave = {
      ...formData,
      id: formData.id || `project-${Date.now()}`,
    };
    
    if (editingIndex !== null) {
      newProjects[editingIndex] = projectToSave;
    } else {
      newProjects.push(projectToSave);
    }
    onChange(newProjects);
    resetForm();
  };

  const handleEditProject = (index: number) => {
    const project = projects[index];
    setFormData(project);
    setTechInput(project.technologies?.join(", ") || "");
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteProject = (index: number) => {
    const newProjects = projects.filter((_, i) => i !== index);
    onChange(newProjects);
  };

  const handleTechInputChange = (value: string) => {
    setTechInput(value);
    const technologies = value.split(",").map((t: string) => t.trim()).filter((t: string) => t);
    setFormData(prev => ({ ...prev, technologies }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2" data-testid="text-step-title">Portfolio Projects</h3>
        <p className="text-sm text-muted-foreground">
          Add projects to showcase your work beyond your LinkedIn experience
        </p>
      </div>

      {projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <Card key={project.id || index} className="overflow-visible">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate" data-testid={`text-project-title-${index}`}>
                        {project.title}
                      </h4>
                      {project.featured && (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="text-xs px-2 py-0.5 bg-muted rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {project.liveUrl && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => window.open(project.liveUrl, "_blank")}
                        data-testid={`button-project-link-${index}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditProject(index)}
                      data-testid={`button-edit-project-${index}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteProject(index)}
                      data-testid={`button-delete-project-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm ? (
        <Card className="overflow-visible">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-title">Project Title *</Label>
              <Input
                id="project-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., E-commerce Platform"
                data-testid="input-project-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the project..."
                className="resize-none"
                rows={3}
                data-testid="input-project-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-live-url">Live Demo URL</Label>
              <Input
                id="project-live-url"
                type="url"
                value={formData.liveUrl || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://example.com"
                data-testid="input-project-live-url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-source-url">Source Code URL</Label>
              <Input
                id="project-source-url"
                type="url"
                value={formData.sourceUrl || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                placeholder="https://github.com/user/project"
                data-testid="input-project-source-url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-image">Image URL</Label>
              <Input
                id="project-image"
                type="url"
                value={formData.image || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                data-testid="input-project-image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-technologies">Technologies (comma-separated)</Label>
              <Input
                id="project-technologies"
                value={techInput}
                onChange={(e) => handleTechInputChange(e.target.value)}
                placeholder="React, Node.js, AWS"
                data-testid="input-project-technologies"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="project-featured" className="cursor-pointer">Featured Project</Label>
              <Switch
                id="project-featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                data-testid="switch-project-featured"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm} data-testid="button-cancel-project">
                Cancel
              </Button>
              <Button onClick={handleSaveProject} disabled={!formData.title.trim()} data-testid="button-save-project">
                {editingIndex !== null ? "Update" : "Add"} Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowForm(true)}
          data-testid="button-add-project"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Portfolio Project
        </Button>
      )}

      {projects.length === 0 && !showForm && (
        <p className="text-center text-sm text-muted-foreground py-4">
          No projects added yet. Portfolio section is optional.
        </p>
      )}
    </div>
  );
}
