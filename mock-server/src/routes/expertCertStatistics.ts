import { Router } from 'express'
import { getEmployeeCertStatistics } from '../data/employeeCertStatistics'
import { successResponse } from '../utils/response'

const router = Router()

router.get('/employee-cert-statistics', (req, res) => {
  const deptCode = typeof req.query.deptCode === 'string' ? req.query.deptCode : '0'
  const personType = typeof req.query.personType === 'string' ? req.query.personType : '0'
  const data = getEmployeeCertStatistics(deptCode, personType)
  return res.json(successResponse(data, 'mock employee cert statistics'))
})

export default router

