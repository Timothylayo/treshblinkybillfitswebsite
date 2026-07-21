import { validateCreateDesign, validateUpdateDesign } from '../interfaces/design.interface.js';
import { httpError } from '../middleware/error.middleware.js';
import { DesignService } from '../services/design.service.js';

export async function getAllDesigns(req, res, next) {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;

    const { data, total } = await DesignService.getAll({ category, search, page, limit });
    return res.success(data, 200, { total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getDesignById(req, res, next) {
  try {
    const { id } = req.params;

    const design = await DesignService.getById(id);
    if (!design) throw httpError(404, `Design ${id} not found`);
    return res.success(design);
  } catch (err) {
    next(err);
  }
}

export async function createDesign(req, res, next) {
  try {
    const { valid, errors } = validateCreateDesign(req.body);
    if (!valid) return res.fail('Validation failed', 400, errors);

    const design = await DesignService.create(req.body);
    return res.created(design);
  } catch (err) {
    next(err);
  }
}

export async function updateDesign(req, res, next) {
  try {
    const { id } = req.params;
    const { valid, errors } = validateUpdateDesign(req.body);
    if (!valid) return res.fail('Validation failed', 400, errors);

    const design = await DesignService.update(id, req.body);
    if (!design) throw httpError(404, `Design ${id} not found`);
    return res.success(design);
  } catch (err) {
    next(err);
  }
}

export async function deleteDesign(req, res, next) {
  try {
    const { id } = req.params;

    await DesignService.delete(id);
    return res.success({ id: Number(id), deleted: true });
  } catch (err) {
    next(err);
  }
}